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
  @Input() width: number;
  @Input() mediaStream: number;
  @Input() usuario: number;
  @Input() streamId: number;

  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
  }

  onClick(){
    this.dialogService.open(VideoFullscreenComponent, {
      header: `Câmera de ${this.usuario}`,
      data: this.mediaStream,
      closeOnEscape: true
  });
  }

}
