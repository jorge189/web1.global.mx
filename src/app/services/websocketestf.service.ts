import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketestfService{

  public socketStatus:boolean = false; 

  constructor(private socket: Socket)  { 
    // super({ url: environment.wsUrlEstafeta, options: {} });
    // console.log(this.on('connect', () => {
    //   console.log('COnectado');
    // }));
  }

  // checkStatus(){
  //   this.socket.on('connect', () => {
  //     console.log('conectado al servidor');
  //     this.socketStatus = true;
  //   });

  //   this.socket.on('disconnect', () => {
  //     console.log('Desconectado del servidor');
  //     this.socketStatus = false;
  //   })
    
  // }
}
