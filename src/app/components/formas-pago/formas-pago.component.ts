import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-formas-pago',
  templateUrl: './formas-pago.component.html',
  styleUrls: ['./formas-pago.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FormasPagoComponent implements OnInit {

  carga:boolean = false;
  html:string = '';

  constructor(private wsApi: ApisService) { }

  ngOnInit() {
    this.carga = true
    this.wsApi.getFormasPago().subscribe((data:any) => {
      this.html = data;
      this.html = this.html.replace('Formas de Pago', '');
    })
  }

}
