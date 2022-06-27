import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GalleriaItem } from 'primeng/galleria';

@Component({
  selector: 'app-video-fullscreen',
  templateUrl: './video-fullscreen.component.html',
  styleUrls: ['./video-fullscreen.component.scss']
})
export class VideoFullscreenComponent implements OnInit {

  constructor(public config: DynamicDialogConfig) { }

  ngOnInit(): void {

    const video = document.querySelector('#meuVideo') as HTMLVideoElement;

    if(video != null){
      video.srcObject = this.config.data.mediaStream;
      video.play();

      video.muted = !!this.config.data.mediaStream;

      video.onpause = () => video.play();
    }

  }

  ativarFullScreen(){
    const video = document.querySelector('#meuVideo') as HTMLVideoElement;

    video.requestFullscreen();
  }

}
