import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserStack } from 'protractor/built/driverProviders';
import { TiendaService } from 'src/app/services/tienda.service';

@Component({
  selector: 'app-metodo-pago',
  templateUrl: './metodo-pago.component.html',
  styleUrls: ['./metodo-pago.component.css']
})
export class MetodoPagoComponent implements OnInit {

  loading: boolean = false;
  metodo: string = 'paypal';
  pedido: any;
  saldo: number = 0;
  factura: boolean = false;
  msgError: string = '';
  carga: boolean = false;

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private wsTienda: TiendaService) {
    this.pedido = data.pedido;
    this.pedido.total = Number(this.pedido.total);

  }

  ngOnInit() {
    this.cambiarMetodo(this.metodo);
  }

  onNoClick() {
    this.dialogRef.close({ ok: false })
  }

  cambiarMetodo(metodo) {
    this.metodo = metodo;
    if (this.metodo == 'saldofavor') {
      this.getSaldoFavor();
      return;
    }
    if (this.metodo == 'prepago') {
      this.getSaldoPrepago();
      return;
    }
  }

  getSaldoFavor() {
    this.saldo = 0;
    this.loading = false;
    this.wsTienda.getSaldoFavor().subscribe((data: any) => {
      this.loading = true;
      if (data.error) {
        return;
      }
      this.saldo = Number(data.data.saldo);
    })
  }

  getSaldoPrepago() {
    this.saldo = 0;
    this.loading = false;
    this.wsTienda.getSaldoPrepago().subscribe((data: any) => {
      this.loading = true;
      if (data.error) {
        return;
      }
      this.saldo = Number(data.data.saldo);
      console.log(this.saldo)
    })
  }

  pagar() {
    switch (this.metodo) {
      case 'saldofavor':
        this.msgError = ''
        this.carga = true;
        this.wsTienda.pagarSaldoFavor(this.pedido.idventa, this.factura).subscribe((data: any) => {
          this.carga = false;
          if (data.error) {
            this.msgError = data.data.message;
            return;
          }
          this.dialogRef.close({ ok: true, idventa: this.pedido.idventa });
        });
        break;
      case 'prepago':
        this.msgError = ''
        this.carga = true;
        this.wsTienda.pagarSaldoPrepago(this.pedido.idventa, false).subscribe((data: any) => {
          console.log(data);
          this.carga = false;
          if (data.error) {
            this.msgError = data.data.message;
            return;
          }
          this.dialogRef.close({ ok: true, idventa: this.pedido.idventa });
        });
        break;
      case 'paypal':
        console.log(this.pedido.total);
        this.msgError = ''
        this.carga = true;
        this.wsTienda.pagarPaypal(this.pedido.idventa, false, this.pedido.total).subscribe((data: any) => {
          console.log(data.data.links[1]);
          if (data.error) {
            this.msgError = data.data.message;
            return;
          }
          window.open(data.data.links[1].href, '_self');
          // this.carga = false;
          // this.dialogRef.close({ ok: true, idventa: this.pedido.idventa });
        });
        break;
      default:
        return;
    }
  }

}
