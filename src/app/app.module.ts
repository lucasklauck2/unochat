import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginaInicialModule } from './components/pagina-inicial/pagina-inicial.module';
import { IpcMainService } from './service/ipc-main.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, PaginaInicialModule],
  providers: [IpcMainService],
  bootstrap: [AppComponent],
})
export class AppModule {}
