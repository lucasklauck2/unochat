import { IpcRenderer } from 'electron';
import { Injectable } from '@angular/core';

@Injectable()
export class IpcMainService {
  private _ipc: IpcRenderer | undefined = void 0;

  constructor() {
    this._ipc = window.require('electron').ipcRenderer;
  }

  public on(channel: string, listener: any): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.on(channel, listener);
  }

  public send(channel: string, ...args: Array<any>): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.send(channel, ...args);
  }
}
