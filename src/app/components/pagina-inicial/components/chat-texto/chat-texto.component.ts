import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-texto',
  templateUrl: './chat-texto.component.html',
  styleUrls: ['./chat-texto.component.scss']
})
export class ChatTextoComponent implements OnInit {

  @Output() onMensagem = new EventEmitter<string>();

  mensagemDigitada: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  enviarMensagem(){

    if(this.mensagemDigitada === ''){
      return;
    }

    const elementoMensagem = document.createElement('div');
    elementoMensagem.classList.add('mensagem');
    const spanMensagem = document.createElement('span');
    spanMensagem.innerHTML = `<b>Eu:</b> ${this.mensagemDigitada}`;
    elementoMensagem.appendChild(spanMensagem);

    document.getElementById('area-mensagens')?.appendChild(elementoMensagem);

    this.onMensagem.emit(this.mensagemDigitada);
    this.mensagemDigitada = '';
  }

  adicionarMensagem(usuario: string, mensagem: string){
    if(mensagem === ''){
      return;
    }

    const elementoMensagem = document.createElement('div');
    elementoMensagem.classList.add('mensagem');
    elementoMensagem.innerHTML = `<b>${usuario} : </b>${mensagem}`;

    document.getElementById('area-mensagens')?.appendChild(elementoMensagem);

  }

  usuarioEntrou(usuario: string){
    const divMensagem = document.createElement('div');
    divMensagem.classList.add('entrou-saiu');
    const spanMensagem = document.createElement('span');
    spanMensagem.innerHTML = `<b>${usuario}</b> entrou`;
    divMensagem.appendChild(spanMensagem);

    document.getElementById('area-mensagens')?.appendChild(divMensagem);
  }

  usuarioSaiu(usuario: string){
    const divMensagem = document.createElement('div');
    divMensagem.classList.add('entrou-saiu');
    const spanMensagem = document.createElement('span');
    spanMensagem.innerHTML = `<b>${usuario}</b> saiu`;
    divMensagem.appendChild(spanMensagem);

    document.getElementById('area-mensagens')?.appendChild(divMensagem);
  }

  teclaPressionada(tecla: any){
    if(tecla.charCode === 13){
      this.enviarMensagem();
    }
  }

}
