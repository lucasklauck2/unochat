import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ChatTextoComponent } from '../chat-texto/chat-texto.component';
import { IpcMainService } from './../../../../service/ipc-main.service';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss'],
})
export class PaginaInicialComponent {
  @ViewChild('chatTexto') chatTexto: ChatTextoComponent;

  title = 'ApiRTC-angular';

  apiRTC = require('@apizee/apirtc');

  conectado: boolean = false;
  entrando: boolean = false;
  mutado: boolean = false;

  nomeSala: string = '';
  canalConectado: string = '';

  localStream: any = null;
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

  // Muta ou desmuta o áudio
  alterarEstadoAudio() {
    this.mutado = !this.mutado;

    this.mutado ? this.localStream.muteAudio() : this.localStream.unmuteAudio();
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
            stream.addInDiv(
              'remote-container',
              'remote-media-' + stream.streamId,
              { width: '400px' },
              false
            );
          })
          .on('streamRemoved', (stream: any) => {
            //Remove a tag <video> com streaming externo do container
            stream.removeFromDiv(
              'remote-container',
              'remote-media-' + stream.streamId
            );
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
            this.localStream = stream;

            stream.removeFromDiv('local-container', 'local-media');

            stream.addInDiv(
              'local-container',
              'local-media',
              { width: '300px' },
              true
            );

            // Entra na sala
            novaSala
              .join()
              .then((response: any) => {
                this.conectado = true;

                this.entrando = false;

                this.ativarChatTexto();

                novaSala.publish(this.localStream);
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
    let remoteContainer = document.getElementById('remote-container');
    let localContainer = document.getElementById('local-container');

    if (remoteContainer) {
      remoteContainer.innerHTML = '';
    }

    if (localContainer) {
      localContainer.innerHTML = '';
    }
  }

  ativarChatTexto() {

    // Escuta as novas mensagens enviadas na sala
    this.salaAtiva.on('message', (e: any) => {
      console.log(e.sender);

      this.chatTexto.adicionarMensagem(e.sender.userData.username, e.content);
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

      this.localStream.release();

      this.salaAtiva.destroy();

      this.userAgent.unregister();

      this.salaAtiva = null;
    })
    .catch((erro: any) => {
      console.error('Erro ao sair da sala', erro);

      this.entrando = false;
    });
  }
}
