import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginaInicialModule } from './components/pagina-inicial/pagina-inicial.module';
import { IpcMainService } from './service/ipc-main.service';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PaginaInicialModule,
    FormsModule,
    ReactiveFormsModule,InputTextModule,ButtonModule
  ],
  providers: [IpcMainService],
  bootstrap: [AppComponent],
})
export class AppModule {}
