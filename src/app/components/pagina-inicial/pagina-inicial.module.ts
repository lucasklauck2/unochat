import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial.component';
import { PaginaInicialRoutingModule } from './pagina-inicial-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ChatTextoComponent } from './components/chat-texto/chat-texto.component';
import {InputTextareaModule} from 'primeng/inputtextarea';

@NgModule({
  declarations: [PaginaInicialComponent, ChatTextoComponent],
  imports: [CommonModule, PaginaInicialRoutingModule, ButtonModule, FormsModule, ReactiveFormsModule, InputTextModule,InputTextareaModule],
})
export class PaginaInicialModule { }
