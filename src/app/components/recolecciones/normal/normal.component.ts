import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { configEnvio } from 'src/app/classes/configEnvio';
import { GlobalpaqService } from 'src/app/services/globalpaq.service';
import { estados } from 'src/app/classes/estados';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { MatDialog } from '@angular/material';
import { DialogoDireccionComponent } from '../../dialogos/dialogo-direccion/dialogo-direccion.component';
import { recoleccion } from 'src/app/classes/guia';

@Component({
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.css']
})
export class NormalComponent implements OnInit, OnChanges {

  @Input() paqueteria: string = 'fedex';
  tracking: string = '';
  msgError: string = '';
  forma: FormGroup;
  estados: any[];
  coloniasRemitente: any;
  guia:any;
  validado:boolean = false;
  checkDirecc: boolean;
  loading:boolean = false;
  loading2:boolean= false;
  msgOk:string = '';

  constructor(private wsGlobal: GlobalpaqService,
    private wsDireccion: DireccionesService,
    private dialog: MatDialog) {
    this.forma = new FormGroup({
      'remitente': new FormGroup({
        'nombre': new FormControl('', Validators.required),
        'compania': new FormControl('', Validators.required),
        'telefono': new FormControl('', [Validators.required, Validators.minLength(1), Validators.max(9999999999)]),
        'calle': new FormControl('', Validators.required),
        'cp': new FormControl('', Validators.required),
        'colonia': new FormControl('', Validators.required),
        'ciudad': new FormControl('', Validators.required),
        'estado': new FormControl('', Validators.required),
      }),
      'recoleccion': new FormGroup({
        'fecha': new FormControl('', Validators.required),
        'horaBefore': new FormControl('', Validators.required),
        'horaAfter': new FormControl('', Validators.required),
        'indicaciones': new FormControl('', [Validators.required, Validators.maxLength(25)])
      }),
      'paquete': new FormGroup({
        'peso': new FormControl(''),
        'alto': new FormControl(''),
        'largo': new FormControl(''),
        'ancho': new FormControl('')
      })
    });
    this.forma.controls['remitente'].get('cp').valueChanges.subscribe(datos => {
      this.wsDireccion.getCp(datos, this.paqueteria).subscribe(data => {
        console.log(data);
        this.coloniasRemitente = data;
        if (data.length > 0) {
          this.forma.controls['remitente'].get('estado').patchValue(data[0].aestado);
          this.forma.controls['remitente'].get('ciudad').setValue((data[0].ciudad == '') ? data[0].ciudadRobot : data[0].ciudad);
          return;
        }
        this.forma.controls['remitente'].get('estado').patchValue("");
        this.forma.controls['remitente'].get('ciudad').setValue("");
      });
    });
    this.estados = estados;
  }

  ngOnInit() {
  }

  ngOnChanges(){
    this.forma.reset();
  }

  direccionGuia(event){
    console.log(event.checked);
    if(!event.checked){
      this.forma.reset();
      return 
    }
    this.llenarCampos(this.guia, 'remitente');
  }

  validarPaqueteria(){
    let form = this.forma.controls;
    let config = configEnvio(this.paqueteria);
    form['remitente'].get('nombre').setValidators(config.nombre);
    form['remitente'].get('compania').setValidators(config.compania);
    form['remitente'].get('calle').setValidators(config.calle);
    form['remitente'].get('ciudad').setValidators(config.ciudad);
    form['remitente'].get('cp').setValidators(config.cp);
    form['remitente'].get('colonia').setValidators(config.colonia);
    form['remitente'].get('estado').setValidators(config.estado);
    form['remitente'].get('telefono').setValidators(config.telefono);
    for (let i in this.forma.get('remitente')['controls']) {
      this.forma.controls['remitente'].get(i).setValue(null, { emitEvent: false });
    }
    this.forma.get('remitente').updateValueAndValidity();
  }


  validarGuia() {
    this.validado = false;
    this.loading = true;
    this.msgOk = '';
    this.wsGlobal.validarRecoleccion(this.tracking, this.paqueteria).subscribe((data: any) => {
      console.log(data);
      this.loading = false;
      if (data.error) {
        this.msgError = data.message;
        return;
      }
      this.validado = true;
      this.guia = data.data
    })
  }

  generar(){
    console.log(this.forma.value );
    const rec = recoleccion(this.forma.getRawValue(), this.guia.tracking);
    console.log(rec);
    this.msgError = '';
    this.loading2 = true;
    this.msgOk = '';
    this.wsGlobal.generateRecoleccion(this.paqueteria, rec).subscribe((data:any) => {
      console.log(data);
      this.loading2 = false;
      if(data.error){
        this.msgError = data.data.message;
        return;
      }
      this.forma.reset();
      this.tracking = '';
      this.msgOk = `Recoleccion Generada Correctamente <br> Recoleccion: <b>${data.data.recoleccion}</b>`;
      this.checkDirecc = false;
    });
  }

  llenarCampos(data, tipo) {
    this.forma['controls'][tipo].get('nombre').setValue(data.nombre);
    this.forma['controls'][tipo].get('compania').setValue(data.compania);
    this.forma['controls'][tipo].get('telefono').setValue(data.telefono);
    this.forma['controls'][tipo].get('calle').setValue(data.direccion);
    this.forma['controls'][tipo].get('cp').setValue(data.cp);
  }

  openDialogDireccion(tipo: string): void {

    const dialogRef = this.dialog.open(DialogoDireccionComponent, {
      width: '800px',
      data: {
        tipo,
        tipoVista: 'buscarDireccion',
        paqueteria: this.paqueteria
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.checkDirecc = false;
        this.llenarCampos(result, tipo);
      }
    });
  }

  noWeekends = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  }

}
