import { Component, OnInit } from '@angular/core';
import { AsociadoService } from 'src/app/services/asociado.service';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css']
})
export class TipsComponent implements OnInit {

    mostrar:boolean=false;;
    tips:any;
    titulo:String;
    comentario:String;
    imagen:String;
    loading:boolean;
  constructor(private wsAsociado:AsociadoService) { }


  ngOnInit() {
    this.wsAsociado.getTips().subscribe((data:any) => {
      this.loading=true;
      if(data.error){
        return
      }
      let longitud =Math.floor(Math.random() * data.data.length);
      this.titulo =data.data[longitud].titulo;
      this.imagen =data.data[longitud].imagen;
      this.comentario =data.data[longitud].comentario;
      this.tips = data.data
      this.mostrar =true;
      if (this.mostrar) {
          setTimeout(()=> {
            this.mostrar=false;
          },8000) 
      }
    })
  }

  ocultar(){
    this.mostrar =false;
  }
}
