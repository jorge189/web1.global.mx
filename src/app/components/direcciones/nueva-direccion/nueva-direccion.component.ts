import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { estados } from '../../../classes/estados';

@Component({
  selector: 'app-nueva-direccion',
  templateUrl: './nueva-direccion.component.html',
  styleUrls: ['./nueva-direccion.component.css']
})
export class NuevaDireccionComponent implements OnInit, OnChanges {

  forma: FormGroup;
  estados: any = estados;
  extraDhl: any;
  extraRedpack: any;
  extraFedex: any;
  @Input() paqueteria: string;

  constructor() {
    this.forma = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'compania': new FormControl('', Validators.required),
      'telefono': new FormControl('', Validators.required),
      'calle': new FormControl('', Validators.required),
      'cp': new FormControl('', Validators.required),
      'colonia': new FormControl('', Validators.required),
      'ciudad': new FormControl('', Validators.required),
      'estado': new FormControl('', Validators.required),
    });
  }

  ngOnInit() {

  }

  initForm(paqueteria) {

    // console.log(data);
    this.extraDhl = false;
    this.extraRedpack = false;
    this.extraFedex = false;
    for (let i in this.forma['controls']) {
      this.forma.get(i).clearValidators();
      this.forma.get(i).setValue(null, { emitEvent: false });
    }

    for (let i in this.forma['controls']) {
      this.forma.get(i).clearValidators();
      this.forma.get(i).setValue(null, { emitEvent: false });
    }

    switch (paqueteria) {
      case 'fedex':
        console.log('entro fedex');
        this.forma.controls['remitente'].get('nombre').setValidators([Validators.required, Validators.maxLength(29)]);

        this.forma.controls['remitente'].get('compania').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['remitente'].get('calle').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['remitente'].get('ciudad').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['remitente'].get('cp').setValidators([Validators.required]);
        this.forma.controls['remitente'].get('colonia').setValidators([Validators.required]);
        this.forma.controls['remitente'].get('estado').setValidators([Validators.required]);
        this.forma.controls['remitente'].get('telefono').setValidators([Validators.required, Validators.minLength(1), Validators.max(9999999999)]);
        this.forma.controls['destinatario'].get('nombre').setValidators([Validators.required, Validators.maxLength(29)]);
        this.forma.controls['destinatario'].get('compania').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['destinatario'].get('calle').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['destinatario'].get('ciudad').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['destinatario'].get('compania').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['destinatario'].get('cp').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('colonia').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('estado').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('telefono').setValidators([Validators.required, Validators.minLength(1), Validators.max(9999999999)]);
        this.extraFedex = true;
        break;
      case 'dhl':
        console.log('si entro dhl');
        this.forma.controls['remitente'].get('nombre').setValidators([Validators.required, Validators.maxLength(29)]);
        this.forma.controls['remitente'].get('compania').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['remitente'].get('calle').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['remitente'].get('ciudad').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['remitente'].get('cp').setValidators([Validators.required]);
        this.forma.controls['remitente'].get('colonia').setValidators([Validators.required]);
        this.forma.controls['remitente'].get('estado').setValidators([Validators.required]);
        this.forma.controls['remitente'].get('referencia1').setValidators([Validators.maxLength(30)]);
        this.forma.controls['remitente'].get('referencia2').setValidators([Validators.maxLength(30)]);
        this.forma.controls['remitente'].get('correo').setValidators([Validators.required, Validators.email]);
        this.forma.controls['remitente'].get('telefono').setValidators([Validators.required, Validators.minLength(1), Validators.max(9999999999)]);
        this.forma.controls['destinatario'].get('nombre').setValidators([Validators.required, Validators.maxLength(29)]);
        this.forma.controls['destinatario'].get('compania').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['destinatario'].get('calle').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['destinatario'].get('ciudad').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['destinatario'].get('compania').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['destinatario'].get('cp').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('colonia').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('estado').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('referencia1').setValidators([Validators.maxLength(30)]);
        this.forma.controls['destinatario'].get('referencia2').setValidators([Validators.maxLength(30)]);
        this.forma.controls['destinatario'].get('correo').setValidators([Validators.required, Validators.email]);
        this.forma.controls['destinatario'].get('telefono').setValidators([Validators.required, Validators.minLength(1), Validators.max(9999999999)]);
        this.extraDhl = true;
        console.log(this.extraDhl);
        // this.forma.controls['remitente'].get('nombre').updateValueAndValidity();
        break;
      case 'estafeta':
        this.forma.controls['remitente'].get('nombre').setValidators([Validators.required, Validators.maxLength(30)]);
        this.forma.controls['remitente'].get('compania').setValidators([Validators.required, Validators.maxLength(50)]);
        this.forma.controls['remitente'].get('calle').setValidators([Validators.required, Validators.maxLength(30)]);
        this.forma.controls['remitente'].get('ciudad').setValidators([Validators.required, Validators.maxLength(50)]);
        this.forma.controls['remitente'].get('cp').setValidators([Validators.required]);
        this.forma.controls['remitente'].get('colonia').setValidators([Validators.required]);
        this.forma.controls['remitente'].get('estado').setValidators([Validators.required]);
        this.forma.controls['remitente'].get('telefono').setValidators([Validators.required, Validators.minLength(1), Validators.max(9999999999)]);
        this.forma.controls['destinatario'].get('nombre').setValidators([Validators.required, Validators.maxLength(30)]);
        this.forma.controls['destinatario'].get('compania').setValidators([Validators.required, Validators.maxLength(50)]);
        this.forma.controls['destinatario'].get('calle').setValidators([Validators.required, Validators.maxLength(30)]);
        this.forma.controls['destinatario'].get('ciudad').setValidators([Validators.required, Validators.maxLength(50)]);
        this.forma.controls['destinatario'].get('cp').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('colonia').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('estado').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('telefono').setValidators([Validators.required, Validators.minLength(1), Validators.max(9999999999)]);
        this.forma.controls['paquete'].get('contenido').setValidators([Validators.required, Validators.maxLength(25)]);
        break;
      case 'redpack':
        this.forma.controls['remitente'].get('nombre').setValidators([Validators.required, Validators.maxLength(29)]);
        this.forma.controls['remitente'].get('compania').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['remitente'].get('calle').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['remitente'].get('ciudad').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['remitente'].get('cp').setValidators([Validators.required]);
        this.forma.controls['remitente'].get('colonia').setValidators([Validators.required]);
        this.forma.controls['remitente'].get('estado').setValidators([Validators.required]);
        this.forma.controls['remitente'].get('numero').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('nombre').setValidators([Validators.required, Validators.maxLength(29)]);
        this.forma.controls['destinatario'].get('compania').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['destinatario'].get('calle').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['destinatario'].get('ciudad').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['destinatario'].get('compania').setValidators([Validators.required, Validators.maxLength(35)]);
        this.forma.controls['destinatario'].get('cp').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('colonia').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('estado').setValidators([Validators.required]);
        this.forma.controls['destinatario'].get('numero').setValidators([Validators.required]);
        this.extraRedpack = true;
        break;
    }

    for (let i in this.forma.get('remitente')['controls']) {
      this.forma.controls['remitente'].get(i).setValue(null, { emitEvent: false });
    }

    for (let i in this.forma.get('destinatario')['controls']) {
      this.forma.controls['destinatario'].get(i).setValue(null, { emitEvent: false });
    }

    this.forma.get('remitente').updateValueAndValidity();
    this.forma.get('destinatario').updateValueAndValidity();
    console.log(this.forma);


    this.estados = estados;
  }

  ngOnChanges() {
    console.log(this.paqueteria)
  }

}
