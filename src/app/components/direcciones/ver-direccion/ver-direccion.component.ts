import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ver-direccion',
  templateUrl: './ver-direccion.component.html',
  styleUrls: ['./ver-direccion.component.css']
})
export class VerDireccionComponent implements OnInit {

  @Input() paqueteria:string;

  constructor() { }

  ngOnInit() {
  }

}
