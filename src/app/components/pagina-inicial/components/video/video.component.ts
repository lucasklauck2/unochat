import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { VideoFullscreenComponent } from '../video-fullscreen/video-fullscreen.component';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  providers: [DialogService]
})
export class VideoComponent implements OnInit {
  @Input() heigth: number;
  @Input() mediaStream: MediaStream;
  @Input() usuario: number;
  @Input() streamId: number;
  @Input() tipoVideo: number;
  @Input() mutado: boolean;

  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
  }

  onClick(){

    this.dialogService.open(VideoFullscreenComponent, {
      header: `${this.tipoVideo === 2 ? 'Tela' : 'Câmera'} de ${this.usuario}`,
      width: this.tipoVideo === 2 ? '60%' : 'auto',
      data: {
        mediaStream: this.mediaStream,
        mutado: this.mutado
      },
      closeOnEscape: true
  });
  }

}
