import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ApiRTC-angular';

  apiRTC = require('@apizee/apirtc');

  conectado: boolean = false;
  entrando: boolean = false;

  nomeSala: string = '';
  canalConectado: string = '';
  

  conversationFormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required]),
  });

  constructor(private fb: FormBuilder) {}

  get conversationNameFc(): FormControl {
    return this.conversationFormGroup.get('name') as FormControl;
  }

  getOrcreateConversation() {

    this.entrando = true;

    this.canalConectado = this.conversationFormGroup.get('name')?.value;

    console.log(`CONECTRNADO`)
    var localStream: any = null;

    //==============================
    // 1/ CREATE USER AGENT
    //==============================
    var ua = new this.apiRTC.UserAgent({
      uri: 'apzkey:6f28322eeb79fa6d43582794c7e4866e',
    });

    console.log(`CONECTRNADO`)
    //==============================
    // 2/ REGISTER
    //==============================
    ua.register().then((session: any) => {
      //==============================
      // 3/ CREATE CONVERSATION
      //==============================
      let novaConversa = session.getConversation(
        this.conversationNameFc.value
      );
      
      this.conectado = true;

      //==========================================================
      // 4/ ADD EVENT LISTENER : WHEN NEW STREAM IS AVAILABLE IN CONVERSATION
      //==========================================================
      novaConversa.on('streamListChanged', (streamInfo: any) => {
        console.log('streamListChanged :', streamInfo);
        if (streamInfo.listEventType === 'added') {
          if (streamInfo.isRemote === true) {
            novaConversa
              .subscribeToMedia(streamInfo.streamId)
              .then((stream: any) => {
                console.log('subscribeToMedia success');
              })
              .catch((err: any) => {
                console.error('subscribeToMedia error', err);
              });
          }
        }
      });
      //=====================================================
      // 4 BIS/ ADD EVENT LISTENER : WHEN STREAM IS ADDED/REMOVED TO/FROM THE CONVERSATION
      //=====================================================
      novaConversa
        .on('streamAdded', (stream: any) => {
          stream.addInDiv(
            'remote-container',
            'remote-media-' + stream.streamId,
            {width: '400px'} ,
            false
          );
        })
        .on('streamRemoved', (stream: any) => {
          stream.removeFromDiv(
            'remote-container',
            'remote-media-' + stream.streamId
          );
        });

      //==============================
      // 5/ CREATE LOCAL STREAM
      //==============================
      ua.createStream({
        constraints: {
          audio: true,
          video: true,
        },
      })
        .then((stream: any) => {
          console.log('createStream :', stream);

          // Save local stream
          localStream = stream;
          stream.removeFromDiv('local-container', 'local-media');
          stream.addInDiv('local-container', 'local-media',   {width: '300px'} , true);

          //==============================
          // 6/ JOIN CONVERSATION
          //==============================
          novaConversa
            .join()
            .then((response: any) => {
              //==============================
              // 7/ PUBLISH LOCAL STREAM
              //==============================
              this.entrando = false;

              novaConversa.publish(localStream);

              console.log('Entrou na conversa: ', response)

              document.getElementById('botao-sair')?.addEventListener('click', ()=>{
                console.log('SAINDO...')
                novaConversa.leave()
                  .then(() => {
                      console.debug('Sucesso ao sair da conversa');
                      this.conectado = false;
                      this.resetarContainers();
                      localStream.release();
                      novaConversa.destroy();
                      ua.unregister();
                      novaConversa = null;
                  }).catch((erro: any) => {
                      console.error('Erro ao sair da conversa', erro);
                      this.entrando = false;
                  });
              });
            })
            .catch((err: any) => {
              console.error('Conversation join error', err);
              this.entrando = false;
            });
        })
        .catch((err: any) => {
          console.error('create stream error', err);
          this.entrando = false;
        });
    }).catch((erro: any)=>this.entrando = false);
  }
  
  resetarContainers() {
    let remoteContainer = document.getElementById('remote-container');
    let localContainer = document.getElementById('local-container');

    if(remoteContainer){
      remoteContainer.innerHTML = '';
    }

    if(localContainer){
      localContainer.innerHTML = '';
    }
  }
}

