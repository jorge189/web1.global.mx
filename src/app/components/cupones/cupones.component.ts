import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.css']
})
export class CuponesComponent implements OnInit {

  cambio:number = 0;
  carga:boolean = true;

  constructor() { }

  ngOnInit() {
  }

  actualizarData(){
    this.cambio += 1;
  }

}
