import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MultiusuarioService } from 'src/app/services/multiusuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuario:any;
  carga: boolean = false;
  paqueteria:string = 'fedex';

  constructor(private active: ActivatedRoute,
    private wsMulti: MultiusuarioService) {
    this.active.params.subscribe((params:any) => {
      console.log(params);
      this.wsMulti.getUsuario(params['id']).subscribe((data:any) => {
        this.carga = true;
        if(data.error){
          return false;
        }
        this.usuario = data.data;
        console.log(this.usuario)
      });
    });
  }

  ngOnInit() {
  }

  cambiarPaqueteria(paqueteria){
    this.paqueteria = paqueteria;
  }

  cambiarPaqueteriaEmiter(){
    console.log('executando')
    let aux = this.paqueteria;
    this.paqueteria = '';
    setTimeout(() => {
      this.paqueteria = aux;
      console.log(this.paqueteria)
    }, 100);
  }

}
