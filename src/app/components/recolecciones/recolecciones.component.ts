import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recolecciones',
  templateUrl: './recolecciones.component.html',
  styleUrls: ['./recolecciones.component.css']
})
export class RecoleccionesComponent implements OnInit {

  paqueteria:string = 'fedex';
  carga:boolean = true;

  constructor(private route: ActivatedRoute) {
    
   }

  ngOnInit() {
    this.route.params.subscribe((param:any) => {
      console.log(param)
      if(param.paqueteria){
        this.cambiarPaqueteria(param.paqueteria)
      }
    })
  }

  cambiarPaqueteria(paqueteria){
    this.paqueteria = paqueteria;
  }


}
