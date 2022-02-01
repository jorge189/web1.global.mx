import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notificacion } from '../components/notificacion/notificacion.component';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  notificaciones:Notificacion[] = []; 
  newNoti:BehaviorSubject<any> = new BehaviorSubject(null);
  constructor() { }

  newNotificacion(notificacion:Notificacion){
    this.notificaciones.push(notificacion);
    this.newNoti.next({id: notificacion.id});
  }

}
