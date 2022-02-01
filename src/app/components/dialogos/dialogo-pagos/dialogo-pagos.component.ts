import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TiendaService } from 'src/app/services/tienda.service';

@Component({
  selector: 'app-dialogo-pagos',
  templateUrl: './dialogo-pagos.component.html',
  styleUrls: ['./dialogo-pagos.component.css']
})
export class DialogoPagosComponent implements OnInit {

  forma:any;
  selectedBanco: string;
  metodos: any[] = ['BANCO', 'PAYPAL(pagos@globalpaq.com)', 'MERCADOPAGO(pagos@globalpaq.com)'];
  bancos: any[] = ['BANCOMER terminación 1738', 'HSBC Terminación 8684', 'BBVA PAOLA 2046'];
  activeBanco: boolean = false;
  activeOtro: boolean = false;
  loading:boolean = false;
  error:boolean = false;
  message:string;

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,public fb:FormBuilder,public wsTienda:TiendaService) {
    this.forma = this.fb.group({
      'metodo': new FormControl('', Validators.required),
      'banco': new FormControl('', this.bancoValidator.bind(this)),
      'referencia': new FormControl('', this.referenciaValidator.bind(this)),
      'fecha': new FormControl('', Validators.required),
      'comprobante': new FormControl(null, [Validators.required] )
    });
  }

  ngOnInit() {
  }

  onNoClick(result:number = 0): void {
    this.dialogRef.close(result);
  }

  buscar(metodo: string) {
    if (metodo == 'BANCO') {
      this.activeBanco = true;
      this.activeOtro = false;
      this.forma.controls['referencia'].setValue('');
      // console.log('hola');
    } else if (metodo == 'OTROS') {
      this.activeOtro = true;
      this.activeBanco = false;
      this.forma.controls['banco'].setValue('');
    }
    else {
      this.activeBanco = false;
      this.activeOtro = false;
      // console.log(this);
      this.forma.controls['referencia'].setValue('');
      this.forma.controls['banco'].setValue('');
    }
  }

  bancoValidator(control: FormControl): { [s: string]: boolean } {
    let forma:any = this;
    if (forma.activeBanco && control.value.length > 0) {
      return null;
    }else if(!forma.activeBanco){
      return null;
    }
    return { valido: true };
  }

  referenciaValidator(control: FormControl): { [s: string]: boolean } {
    let forma:any = this;
    if (forma.activeOtro && control.value.length > 0) {
      return null;
    }else if(!forma.activeOtro){
      return null;
    }
    return { valido: true };
  }

  requiredFileType(type: string){
    return function(control: FormControl) : { [s: string]: boolean }{
      const file = control.value;
      console.log(file);
      if(file){
        const extension:string = file.split(';')[1].split(':')[1].toLowerCase();
        if(type.toLowerCase() !== extension.toLowerCase()){
          return {requiredFileType: true}
        }
        return null;
      }
      return null;
    };
  }

  onFileChange(event){
    const reader = new FileReader();

    if(event.target.file && event.target.file.length){
      const [file] = event.target.file;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.forma.patchValue({
          comprobante: reader.result
        })
      }
      // console.log(reader.result);
    }
  }

  enviarComprobante() {
    this.error = false;
    console.log(this.forma.value.comprobante[0]);
    this.loading = true;
    let body = new FormData();
        body.append('comprobante', this.forma.value.comprobante[0]);
        body.append('idventa', this.data.id);
        body.append('tipo_banco', this.forma.value.banco != '' ? this.forma.value.banco : this.forma.value.metodo);
        body.append('referencia', this.forma.value.referencia);
        body.append('fecha_pago', this.forma.value.fecha);

    this.wsTienda.sendComprobante(body).subscribe((data:any) => {
      console.log(data);
      if(data.registrado){
        this.onNoClick(1);
        console.log('insertado',data);
      }else{
        this.error = true;
        this.message = data.message;
      }
      this.loading = false;
    });
    // console.log(body);
  }

}
