import { Component, OnInit } from '@angular/core';
import { DevolucionGuiaService } from 'src/app/services/devolucion-guia.service';

@Component({
  selector: 'app-devolucion-masiva',
  templateUrl: './devolucion-masiva.component.html',
  styleUrls: ['./devolucion-masiva.component.css']
})
export class DevolucionMasivaComponent implements OnInit {
  paqueteria: string = "fedex";
  cancelaciones = [];
  textarea = '';
  tracking: any[] = [];
  visible = false;
  constructor(private wsDevolucion: DevolucionGuiaService) { }

  ngOnInit() {
  }

  cambiarPaqueteria(paqueteria: any) {
    this.paqueteria = paqueteria;
    this.visible = false;
  }

  cancelar() {
    let salida = {
      paqueteria: this.paqueteria,
      lista: this.textarea
    }
    this.wsDevolucion.setCancelacion(salida).subscribe((data: any) => {
      if (data.error == false) {
        this.visible = true;
        for (const contador of data.data) {
          let track = contador.tracking
          var index = track.indexOf('CANCEL');
          if (index >= 0) {
            contador.tracking = contador.tracking.replace(/[^0-9\n]*/g, '');
          }
        }
        this.cancelaciones = data.data;
      } else {
        this.visible = false
      }
    })

    this.tracking = [];
    this.textarea= '';
  }

}
