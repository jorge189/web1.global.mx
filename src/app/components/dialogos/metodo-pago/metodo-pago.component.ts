import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserStack } from 'protractor/built/driverProviders';
import { TiendaService } from 'src/app/services/tienda.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare var Mercadopago: any;
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
  miFormulario: FormGroup;
  token: string = '';
  idPago: string = '';
  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private wsTienda: TiendaService) {
    this.pedido = data.pedido;
    this.pedido.total = Number(this.pedido.total);

    this.miFormulario = new FormGroup({
      'cardNumber': new FormControl(),
      'cardholderName': new FormControl(),
      'securityCode': new FormControl(),
      'cardExpirationMonth': new FormControl(),
      'cardExpirationYear': new FormControl(),
    })
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
  async enviar() {
    let dateCard = this.miFormulario.value.cardExpirationMonth;
    this.miFormulario.get('cardExpirationMonth').setValue(dateCard.substring(0,2));
    this.miFormulario.get('cardExpirationYear').setValue(dateCard.substring(2,4));
    
    const mp = new Mercadopago('APP_USR-2637960a-22c3-491e-acb0-04f99e7ec676', {
      locale: 'es-MX',
      advancedFraudPrevention: true,
    })
    // Mercadopago.setPublishableKey("APP_USR-2637960a-22c3-491e-acb0-04f99e7ec676");

    let detalleTarjeta = this.miFormulario.value
    console.log(detalleTarjeta);
    let bin = detalleTarjeta.cardNumber.toString();
    bin = bin.substring(0, 6)
    console.log(bin)

    const paymentMethods = await new Promise((resolve, reject) => {
      mp.getPaymentMethods({ bin: bin })
      resolve(true)
    }) 
console.log(paymentMethods);
    mp.getPaymentMethod({
      "bin": bin
    }, this.setPaymentMethod.bind(this));
    mp.createToken(this.miFormulario.value, this.getToken.bind(this))
    //para la version dos es MercadoPago
  };
  setPaymentMethod(status, response) {
    let paymethod= response[0]
    // console.log(paymethod.id)
    this.idPago= paymethod.id
}


getToken (status, response) {
  console.log(status);
  console.log(response.id)
  this.token = response.id
  let ObjectData = {
    "token": this.token,
    "monto": this.pedido.total,
    "paymentMethodId": this.idPago,
    "action": "Capturar_ordenPago",
    "factura": this.factura,
    "idventa": this.pedido.idventa
  };
  console.log(ObjectData);
  this.wsTienda.mercadoPago(ObjectData).subscribe((data: any) => {
    console.log(data)
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
        case 'mercadopago':
          console.log(this.pedido.total);
  
        break;
      default:
        return;
    }
  }

}
