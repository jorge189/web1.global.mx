import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  constructor() { }

  paqueteria: string = "fedex";

  ngOnInit() {
  }

  cambiarPaqueteria(paqueteria){
    this.paqueteria = paqueteria;
  }

}
