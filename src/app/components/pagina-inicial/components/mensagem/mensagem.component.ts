import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mensagem',
  templateUrl: './mensagem.component.html',
  styleUrls: ['./mensagem.component.scss']
})
export class MensagemComponent implements OnInit {
  @Input() tipoMensagem: number;
  @Input() mensagem: string;
  @Input() usuario: string;
  @Input() horario: Date;
  @Input() jaIdentificado: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  formatarHorario(data: Date){
    return `${this.ajustarCasasHorario(data.getHours())}:${this.ajustarCasasHorario(data.getMinutes())}`
  }

  private ajustarCasasHorario(valor: number) {
    return valor < 10 ? `0${valor}` : valor;
  }

}

