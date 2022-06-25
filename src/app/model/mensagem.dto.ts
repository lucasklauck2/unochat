export class Mensagem {
  usuario: string;
  usuarioId: number;
  mensagem: string;
  horario: Date;
  tipo: number;

  constructor(usuario: string, usuarioId: number, mensagem: string, horario: Date, tipo: number){
    this.usuario = usuario;
    this.usuarioId = usuarioId;
    this.mensagem = mensagem;
    this.horario = horario;
    this.tipo = tipo;
  }
}
