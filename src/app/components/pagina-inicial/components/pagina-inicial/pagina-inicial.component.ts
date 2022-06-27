import { Component, ComponentRef, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ChatTextoComponent } from '../chat-texto/chat-texto.component';
import { VideoComponent } from '../video/video.component';
import { IpcMainService } from './../../../../service/ipc-main.service';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss'],
})
export class PaginaInicialComponent implements OnDestroy{
  @ViewChild('chatTexto') chatTexto: ChatTextoComponent;
  @ViewChild('videosLocais', { read: ViewContainerRef , static: true}) videosLocais: any;
  @ViewChild('videosRemotos', { read: ViewContainerRef , static: true}) videosRemotos: any;

  apiRTC = require('@apizee/apirtc');

  mapaComponenteVideoRemoto = new Map<string, ComponentRef<VideoComponent>>();
  listaVideosLocais: Array<ComponentRef<VideoComponent>> = [];

  conectado: boolean = false;
  entrando: boolean = false;
  mutado: boolean = false;
  compartilhandoTela: boolean = false;

  nomeSala: string = '';
  canalConectado: string = '';

  videoStreamLocal: any = null;
  screenStreamLocal: any = null;
  salaAtiva: any;
  userAgent: any;

  form = this.fb.group({
    codigoSala: this.fb.control('', [Validators.required]),
    usuario: this.fb.control('', [Validators.required]),
  });

  constructor(
    private fb: FormBuilder,
    private ipcMainService: IpcMainService
  ) {}

  get codigoSala(): FormControl {
    return this.form.get('codigoSala') as FormControl;
  }

  ngOnDestroy(): void {
    this.mapaComponenteVideoRemoto.forEach((valor, chave) => valor.destroy());
  }

  // Muta ou desmuta o áudio
  alterarEstadoAudio() {
    this.mutado = !this.mutado;

    this.mutado ? this.videoStreamLocal.muteAudio() : this.videoStreamLocal.unmuteAudio();
  }

  entrarSala() {
    this.entrando = true;

    this.canalConectado = this.form.get('codigoSala')?.value;

    // Criação do userAgent com o token da apizee.com
    var ua = new this.apiRTC.UserAgent({
      uri: 'apzkey:6f28322eeb79fa6d43582794c7e4866e',
    });

    this.userAgent = ua;

    // Registra o usuário e gera uma sessão
    ua.register()
      .then((session: any) => {

        session.setUsername(this.form.get('usuario')?.value);

        // Cria conversa com o código da sala
        let novaSala = session.getConversation(this.codigoSala.value);

        this.salaAtiva = novaSala;

        console.log('nova sala: ',novaSala)

        // Quando um novo streaming de dados estiver disponível na conversa
        novaSala.on('streamListChanged', (streamInfo: any) => {

          if (streamInfo.listEventType === 'added') {

            if (streamInfo.isRemote === true) {

              // Da um subscribe no streaming externo
              novaSala
                .subscribeToMedia(streamInfo.streamId)
                .then((stream: any) => {
                  console.log('Sucesso na subscrição do streaming');
                })
                .catch((erro: any) => {
                  console.error('Erro na subscrição do streaming', erro);
                });
            }
          }
        });

        // Quando um streaming de dados é adicionado ou removido da conversa
        novaSala
          .on('streamAdded', (stream: any) => {

            // Adiciona a tag <video> com o streaming externo no container
            const componentRef = this.videosRemotos.createComponent(VideoComponent);
            componentRef.instance.heigth = 250;
            componentRef.instance.mediaStream = stream.data;
            componentRef.instance.usuario = stream.contact.userData.username;

            if(!stream.callAudioActive){
              componentRef.instance.tipoVideo = 2;
            }

            this.mapaComponenteVideoRemoto.set(stream.streamId.toString(), componentRef);
          })
          .on('streamRemoved', (stream: any) => {
            //Remove a tag <video> com streaming externo do container
            this.mapaComponenteVideoRemoto.get(stream.streamId.toString())?.destroy();
            this.mapaComponenteVideoRemoto.delete(stream.streamId.toString());
          });

        // Cria um streaming de dados local
        ua.createStream({
          constraints: {
            audio: true,
            video: true,
          },
        })
          .then((stream: any) => {
            // Salva o streaming de dados local
            this.videoStreamLocal = stream;

            console.log('STREAM: ', stream);

            const componentRef = this.videosLocais.createComponent(VideoComponent);
            componentRef.instance.heigth = 200;
            componentRef.instance.mediaStream = stream.data;
            componentRef.instance.usuario = 'Você'
            componentRef.instance.mutado = true;

            this.listaVideosLocais.push(componentRef);

            // Entra na sala
            novaSala
              .join()
              .then((response: any) => {
                this.conectado = true;

                this.entrando = false;

                this.ativarChatTexto();

                novaSala.publish(this.videoStreamLocal);
              })
              .catch((erro: any) => {
                console.error('Erro ao entrar na conversa', erro);

                this.entrando = false;
              });
          })
          .catch((err: any) => {
            console.error('create stream error', err);
            this.entrando = false;
          });
      })
      .catch((erro: any) => (this.entrando = false));
  }

  resetarContainers() {
    this.mapaComponenteVideoRemoto.forEach((valor, chave) => valor.destroy());

    this.listaVideosLocais.forEach(componente => componente.destroy());
  }

  ativarChatTexto() {

    // Escuta as novas mensagens enviadas na sala
    this.salaAtiva.on('message', (e: any) => {
      console.log(e.sender);

      this.chatTexto.adicionarMensagem(e.sender.userData.username, e.sender.userData.id, e.content);
    });

    // Escuta novas entradas e saidas de usuários na sala
    this.salaAtiva
      .on('contactJoined', (contato: any) => {
        this.chatTexto.usuarioEntrou(contato.userData.username);

        console.log('Um usuário entrou da sala :', contato);
      })
      .on('contactLeft', (contato: any) => {
        this.chatTexto.usuarioSaiu(contato.userData.username);

        console.log('Um usuário saiu da sala :', contato);
      });
  }

  fecharAplicacao() {
    this.ipcMainService.send('sair');
  }

  enviarMensagem(mensagem: string) {
    this.salaAtiva.sendMessage(mensagem);
  }

  sairSala(){

    this.salaAtiva
    .leave()
    .then(() => {
      console.debug('Sucesso ao sair da sala');

      this.conectado = false;

      this.resetarContainers();

      this.videoStreamLocal.release();

      this.screenStreamLocal.release();

      this.salaAtiva.destroy();

      this.userAgent.unregister();

      this.salaAtiva = null;
    })
    .catch((erro: any) => {
      console.error('Erro ao sair da sala', erro);

      this.entrando = false;
    });
  }

  iniciarScreenSharing(){

    if(!!this.screenStreamLocal){

      this.screenStreamLocal.release();

      return;
    }

    const displayMediaStreamConstraints = {
      video: {
          cursor: "always"
      },
      audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
      }
  };

  this.apiRTC.Stream.createDisplayMediaStream(displayMediaStreamConstraints, false)
      .then((stream: any )=> {

          stream.on('stopped', ()=> {
            this.listaVideosLocais.forEach(componente => {
              console.log(componente);
              if(componente.instance.tipoVideo === 2){
                console.log('DESTRUINDOI');

                componente.destroy();
              }
            });

            this.screenStreamLocal = null;

            this.compartilhandoTela = false;
          });

          this.compartilhandoTela = true;

          this.screenStreamLocal = stream;

          this.salaAtiva.publish(this.screenStreamLocal);
      })
      .catch((erro: any) => {
          console.error('Could not create screensharing stream :', erro);
      });
  }
}
