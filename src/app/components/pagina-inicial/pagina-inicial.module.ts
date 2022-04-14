import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial.component';
import { PaginaInicialRoutingModule } from './pagina-inicial-routing.module';

@NgModule({
  declarations: [PaginaInicialComponent],
  imports: [CommonModule, PaginaInicialRoutingModule,ButtonModule],
})
export class PaginaInicialModule {}
