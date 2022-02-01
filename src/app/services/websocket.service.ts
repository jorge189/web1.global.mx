import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';


export class WebsocketService extends Socket {

  public socketStatus:boolean = false; 

  constructor(url:string) {
    super({url: url, options: {}})
    console.log('conectando', environment.wsUrlEstafeta)
    // this.socket.connect();
  }

  checkStatus(){
    this.on('connect', () => {
      console.log('conectado al servidor');
      this.socketStatus = true;
    });

    this.on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus = false;
    })
  }

  emitMessage(mensaje: string, data?:any, callback?: Function){
    this.emit(mensaje, data, callback)
  }

  onMessage(eventMensaje: string, callback: Function){
    this.on(eventMensaje, callback);
  }


}
