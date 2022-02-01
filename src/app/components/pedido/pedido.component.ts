import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TiendaService } from 'src/app/services/tienda.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  articulos: any;
  total:number = 0;
  idventa:number = 0;

  constructor(private activated:ActivatedRoute, private wsTienda:TiendaService) {
    this.activated.params.subscribe(params => {
      this.wsTienda.getDetallePedido(params['id']).subscribe((data:any) => {
        console.log(data);
        this.articulos = data;
        for(let articulo of this.articulos){
          this.total += (articulo.cantidad * articulo.precio);
        }
        this.idventa = params['id'];
      });
    });
  }

  ngOnInit() {
  }

}
