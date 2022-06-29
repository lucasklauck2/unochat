import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mensagem } from 'src/app/model/mensagem.dto';

@Component({
  selector: 'app-chat-texto',
  templateUrl: './chat-texto.component.html',
  styleUrls: ['./chat-texto.component.scss'],
})
export class ChatTextoComponent implements OnInit {
  @Output() onMensagem = new EventEmitter<string>();

  mensagemDigitada: string = '';

  mensagens: Array<Mensagem> = [];

  constructor() {}

  ngOnInit(): void {}

  adicionarMensagemPropria(mensagem: string){
    this.moverScroll();
    this.mensagens.push(new Mensagem('', 0, mensagem, new Date(), 1));
  }

  adicionarMensagemExterna(usuario: string, usuarioId: number,mensagem: string){
    this.mensagens.push(new Mensagem(usuario, usuarioId, mensagem, new Date(), 2));

    this.moverScroll();
  }

  adicionarMensagemEntrouSaiu(usuario: string,mensagem: string){
    this.mensagens.push(new Mensagem(usuario, 0, mensagem,new Date(), 3));

    this.moverScroll();
  }

  moverScroll(){
   const elemento = document.getElementById('area-mensagens');

   if(!!elemento){

      setTimeout(() => {
        elemento.scrollTop = elemento.scrollHeight;
      }, 100);
   }
  }

  enviarMensagem() {
    if (this.mensagemDigitada === '') {
      return;
    }

    this.adicionarMensagemPropria(this.mensagemDigitada);

    this.onMensagem.emit(this.mensagemDigitada);
    this.mensagemDigitada = '';
  }

  adicionarMensagem(usuario: string, usuarioId: number, mensagem: string) {
    if (mensagem === '') {
      return;
    }

    this.adicionarMensagemExterna(usuario, usuarioId, mensagem);
  }

  usuarioEntrou(usuario: string) {
    this.adicionarMensagemEntrouSaiu(usuario, 'entrou')
  }

  usuarioSaiu(usuario: string) {
    this.adicionarMensagemEntrouSaiu(usuario, 'saiu')
  }

  teclaPressionada(tecla: any) {
    if (tecla.charCode === 13) {
      this.enviarMensagem();
    }
  }
}
