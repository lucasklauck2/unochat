import { Component, OnInit } from '@angular/core';
import { IpcMainService } from './../../../../service/ipc-main.service';

@Component({
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss'],
})
export class PaginaInicialComponent implements OnInit {
  constructor(private ipcMainService: IpcMainService) {}

  ngOnInit(): void {}

  sair() {
    this.ipcMainService.send('sair');
  }
}
