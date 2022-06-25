import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial.component';
import { PaginaInicialRoutingModule } from './pagina-inicial-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MensagemComponent } from './components/mensagem/mensagem.component';
import { ChatTextoComponent } from './components/chat-texto/chat-texto.component';
import { VideoComponent } from './components/video/video.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { VideoFullscreenComponent } from './components/video-fullscreen/video-fullscreen.component';
import {GalleriaModule} from 'primeng/galleria';

@NgModule({
  declarations: [
    PaginaInicialComponent,
    MensagemComponent,
    ChatTextoComponent,
    VideoComponent,
    VideoFullscreenComponent,
  ],
  imports: [
    CommonModule,
    PaginaInicialRoutingModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DynamicDialogModule,GalleriaModule
  ],
})
export class PaginaInicialModule {}
