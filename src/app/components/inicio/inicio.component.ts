import { Component, OnInit } from '@angular/core';

//Service
import { GlobalpaqService } from '../../services/globalpaq.service';
import { AsociadoService } from 'src/app/services/asociado.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  fedex: any = [];
  dhl: any = [];
  estafeta: any = [];
  redpack: any = [];
  paquetexpress:any = [];
  gloExpress:any = [];
  info: any = [];
  loading: boolean = false;
  carga: boolean;
  paq:string= 'fedex';
  images:any=[];
  porciento:any
  constructor(private gp: GlobalpaqService, private wsAsociado: AsociadoService) {
    this.carga = false;
    wsAsociado.getInfoAsociado().subscribe((data: any) => {
      this.info = data;
      console.log(this.info);
      this.carga = true;
    });
    gp.getGuiasDisponibles('fedex').subscribe((data: any) => {
      this.fedex = data;
      // console.log(this.fedex);
      // console.log(Array.isArray(this.fedex.terrestre));
    });
    gp.getGuiasDisponibles('dhl').subscribe((data: any) => {
      this.dhl = data;
      // console.log(this.dhl);
    });
    gp.getGuiasDisponibles('estafeta').subscribe((data: any) => {
      this.estafeta = data;
      // console.log(this.estafeta);
    });
    gp.getGuiasDisponibles('redpack').subscribe((data: any) => {
      this.redpack = data;
      //console.log(this.redpack);
    });
    gp.getGuiasDisponibles('paquetexpress').subscribe((data: any) => {
      this.paquetexpress = data;
       //console.log(this.paquetexpress);
    });
    
    gp.getGuiasDisponibles('globalpaq').subscribe((data: any) => {
      
     if(!data){
      this.loading = true; 
      return}
      
      this.gloExpress = data;
      this.loading = true;
     // console.log(this.gloExpress);
    });
    }
  

  ngOnInit() {
    this.gp.getImages().subscribe((data:any)=>{
      console.log(data.data);
      for (let index = 0; index < data.data.length; index++) {
      
        if (data.data[index].id_ubicacion == 2) {
          data.data[index].nomImage = "https://sistema.globalpaq.mx/images/"+data.data[index].carouselcol;
          console.log(data.data[index].nomImage);
          this.images.push(data.data[index]);
        }
      }
      
    })
  }
  cambiarPaqueteria(paqueteria){
    this.paq = paqueteria;
   
  } 
  getPorcent(total,disponibles){
    let porcent = ((disponibles/total)*100).toFixed(0);
    
    return `${porcent}%`
  }
  getGrad(total,disponibles){
    let porcent2 = ((disponibles/total)*100).toFixed(0);
    return`linear-gradient(to right, white ${porcent2}, black 2%);
    `;
    
  }
  getGradiant(total, disponibles) {
    let totalPor = parseInt(((180 / 100) * ((disponibles * 100) / total)).toFixed(0));
    let porcent2 = (((disponibles/total)*100) -2);
    totalPor = (totalPor < 0 || totalPor === NaN || disponibles < 0) ? 0 : totalPor;
    return `linear-gradient(
      86deg,
      white ${porcent2}%,
      black 2%)`;
  }
}
    
    


