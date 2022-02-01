import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NotificacionService } from 'src/app/services/notificacion.service';

export interface Notificacion {
  id: string;
  titulo: string;
  icon: string;
  date: string;
  html: string;
  time: number;
  activo: boolean;
}

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnChanges {

  notificaciones: Notificacion[] = [];
  @Input() notificacion: Notificacion;

  constructor(private wsNotificacion: NotificacionService) {
    this.notificaciones = this.wsNotificacion.notificaciones;
    this.wsNotificacion.newNoti.subscribe((value) => {
      console.log(value);
      if (!value) {
        return;
      }
      this.newNotification(value.id);
    })
  }

  ngOnChanges() {

  }

  newNotification(id: string) {
    let i = this.notificaciones.findIndex(element => element.id === id);
    setTimeout(() => {
      let i = this.notificaciones.findIndex(element => element.id === id);
      console.log('index', i);
      console.log(this.notificaciones)
      this.notificaciones.splice(i, 1);
      console.log('cerrando')
    }, this.notificaciones[i].time);
  }

  closeToast(id:string){
    let i = this.notificaciones.findIndex(element => element.id === id);
    this.notificaciones.splice(i, 1);
  }

}
