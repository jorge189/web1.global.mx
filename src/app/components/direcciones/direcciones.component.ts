import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent implements OnInit {

  paqueteria:string;


  constructor() { }

  ngOnInit() {
    this.cambiarPaqueteria('fedex');
  }

  cambiarPaqueteria(paq){
    this.paqueteria = paq;
  }

}
