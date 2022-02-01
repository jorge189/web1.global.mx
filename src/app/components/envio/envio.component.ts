import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { estados } from '../../classes/estados';
import { GlobalpaqService } from 'src/app/services/globalpaq.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogoDireccionComponent } from '../dialogos/dialogo-direccion/dialogo-direccion.component';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { guia, guiaRobot, paqueteAdicional, recoleccion } from 'src/app/classes/guia';
import { GenerarComponent } from '../dialogos/generar/generar.component';
import { AsociadoService } from 'src/app/services/asociado.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { configEnvio } from 'src/app/classes/configEnvio';
import { AvisosService } from 'src/app/services/avisos.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { Notificacion } from '../notificacion/notificacion.component';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-envio',
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.css']
})
export class EnvioComponent implements OnInit {

  isLinear: boolean = true;
  carga: boolean;
  forma: FormGroup;
  paqueteria: string = "fedex";
  estados: any[];
  diaSig: any[];
  terr: any[];
  disponibles: any[];
  coloniasRemitente: any[];
  coloniasDestinatario: any[];
  extraDhl: boolean = false;
  extraRedpack: boolean = false;
  extraFedex: boolean = false;
  extraPaquetexpress: boolean = false;
  extraGlobalpaq: boolean = false;
  dataRecoleccion: boolean = false;
  loadingG: boolean = false;
  idusuario: number;
  remitentes: any[];
  loadingRems: boolean = false;
  cantidadRem: any;
  maximoRem: any;
  correoAsociado: string;
  alertGuias: boolean = true;
  avisos: any[] = [];
  viewSeguro: boolean = true;
  montoSeguro: Array<any> = [];
  montoFirst: number = 0;
  recoleccion: number;
  excedente: number;
  loadingGeneracion: boolean = false;
  permisos:any;
  cantidadPaquetes: number = 0;
  paquetes: FormArray = new FormArray([]);

  @Output() terminar: EventEmitter<any> = new EventEmitter();



  constructor(private wsGlobal: GlobalpaqService,
    public dialog: MatDialog,
    private wsDireccion: DireccionesService,
    private wsAsociado: AsociadoService,
    private wsAvisos: AvisosService,
    // public wsSocket: WebsocketService,
    private wsNotificacion: NotificacionService,
  ) {
    this.wsAsociado.getInfoAsociado().subscribe((data: any) => {
      this.idusuario = data.idusuario;
      this.correoAsociado = data.correo;
      this.recoleccion = data.recoleccion;
      this.excedente = data.excedente;
      this.permisos = data.permisos;
      console.log('asociado', data)
    });



    this.forma = new FormGroup({
      'datos': new FormGroup({
        'tipoguia': new FormControl('', Validators.required),
        'paqueteria': new FormControl('', Validators.required),
        'pesoguia': new FormControl('', Validators.required)
      }),
      'remitente': new FormGroup({
        'nombre': new FormControl('', Validators.required),
        'compania': new FormControl('', Validators.required),
        'telefono': new FormControl('', [Validators.required, Validators.minLength(1), Validators.max(9999999999)]),
        'calle': new FormControl('', Validators.required),
        'cp': new FormControl('', Validators.required),
        'colonia': new FormControl('', Validators.required),
        'ciudad': new FormControl({ value: '', disabled: true }, Validators.required),
        'estado': new FormControl({ value: '', disabled: true }, Validators.required),
        'referencia1': new FormControl(''),
        'referencia2': new FormControl(''),
        'numero': new FormControl(''),
        'correo': new FormControl(''),
        'tipo': new FormControl('1')
      }),
      'destinatario': new FormGroup({
        'nombre': new FormControl('', Validators.required),
        'compania': new FormControl('', Validators.required),
        'telefono': new FormControl('', [Validators.required, Validators.minLength(1), Validators.max(9999999999)]),
        'calle': new FormControl('', Validators.required),
        'cp': new FormControl('', Validators.required),
        'colonia': new FormControl('', Validators.required),
        'ciudad': new FormControl({ value: '', disabled: true }, Validators.required),
        'estado': new FormControl({ value: '', disabled: true }, Validators.required),
        'referencia1': new FormControl(''),
        'referencia2': new FormControl(''),
        'numero': new FormControl(''),
        'correo': new FormControl(''),
        'tipo': new FormControl('0')
      }),
      'paquete': new FormGroup({
        'largo': new FormControl('', Validators.required),
        'alto': new FormControl('', Validators.required),
        'ancho': new FormControl('', Validators.required),
        'peso': new FormControl('', Validators.required),
        'pesov': new FormControl({ value: '0', disabled: true }),
        'contenido': new FormControl(''),
        'comentario': new FormControl(''),
        'seguro': new FormControl('0')
      }),
      'adicional': new FormGroup({
        'correo': new FormControl(''),
        'adicional': new FormControl(''),
        'seguimiento': new FormControl(''),
        'seguimientoAdicional': new FormControl(''),
        'papel': new FormControl(''),
        'recoleccion': new FormControl('', Validators.required),
        'checkAdicionalSeg': new FormControl(false),
        'checkSeg': new FormControl(false),
        'checkAdicional': new FormControl(false),
        'checkConfirmacion': new FormControl(false)
      }),
      'recoleccion': new FormGroup({
        'fecha': new FormControl(''),
        'horaBefore': new FormControl(''),
        'horaAfter': new FormControl(''),
        'indicaciones': new FormControl('', Validators.maxLength(25))
      }),
      'paquetes': this.paquetes
    });

    this.forma.get('datos').valueChanges.subscribe(data => {
      this.llenarDisponibles(data.tipoguia)
      console.log(this.disponibles);
    });

    this.forma.controls['remitente'].get('cp').valueChanges.subscribe(datos => {
      let paqueteria = this.forma.value.datos.paqueteria;
      this.wsDireccion.getCp(datos, paqueteria).subscribe(data => {
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

    this.forma.controls['destinatario'].get('cp').valueChanges.subscribe((datos: any) => {
      let paqueteria = this.forma.value.datos.paqueteria;
      this.wsDireccion.getCp(datos, paqueteria).subscribe(data => {
        console.log(data);
        this.coloniasDestinatario = data;
        if (data.length > 0) {
          this.forma.controls['destinatario'].get('estado').patchValue(data[0].aestado);
          this.forma.controls['destinatario'].get('ciudad').setValue((data[0].ciudad == '') ? data[0].ciudadRobot : data[0].ciudad);

          return;
        }
        this.forma.controls['destinatario'].get('estado').patchValue("");
        this.forma.controls['destinatario'].get('ciudad').setValue("");
      });
    });

    this.forma.get('paquete').valueChanges.subscribe(data => {
      let pesoV = (this.forma.value.paquete.largo * this.forma.value.paquete.alto * this.forma.value.paquete.ancho) / 5000
      this.forma.controls['paquete'].get('pesov').setValue(Math.ceil(pesoV), { emitEvent: false });
    });

    this.forma.get('paquetes').valueChanges.subscribe(data => {
      if (this.forma.value.paquetes.length > 0) {
        for (let i in this.forma.get('paquetes')['controls']) {
          let pesoV = (this.forma.value.paquetes[i].largo * this.forma.value.paquetes[i].alto * this.forma.value.paquetes[i].ancho) / 5000
          this.forma.get('paquetes')['controls'][i].get('pesov').setValue(Math.ceil(pesoV), { emitEvent: false });
        }
      }
    });


    this.forma.controls['adicional'].get('recoleccion').valueChanges.subscribe(data => {
      console.log(data);
      if (data == 1) {
        this.dataRecoleccion = true;
        for (let i in this.forma.get('recoleccion')['controls']) {
          this.forma.controls['recoleccion'].get(i).setValidators([Validators.required]);
        }
        this.forma.get('recoleccion').updateValueAndValidity();
        return;
      }
      for (let i in this.forma.get('recoleccion')['controls']) {
        this.forma.controls['recoleccion'].get(i).clearValidators();
        this.forma.controls['recoleccion'].get(i).setValue(null, { emitEvent: false });
      }
      this.forma.get('recoleccion').updateValueAndValidity();
      this.dataRecoleccion = false;
    });

    this.forma.controls['datos'].get('paqueteria').valueChanges.subscribe(data => {
      console.log(data);
      this.extraDhl = false;
      this.extraRedpack = false;
      this.extraFedex = false;
      this.extraPaquetexpress = false;
      this.extraGlobalpaq = false;
      for (let i in this.forma.get('remitente')['controls']) {
        this.forma.controls['remitente'].get(i).clearValidators();
        this.forma.controls['remitente'].get(i).setValue(null, { emitEvent: false });
      }

      for (let i in this.forma.get('destinatario')['controls']) {
        this.forma.controls['destinatario'].get(i).clearValidators();
        this.forma.controls['destinatario'].get(i).setValue(null, { emitEvent: false });
      }
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
      form['destinatario'].get('nombre').setValidators(config.nombre);
      form['destinatario'].get('compania').setValidators(config.compania);
      form['destinatario'].get('calle').setValidators(config.calle);
      form['destinatario'].get('ciudad').setValidators(config.ciudad);
      form['destinatario'].get('cp').setValidators([Validators.required]);
      form['destinatario'].get('colonia').setValidators([Validators.required]);
      form['destinatario'].get('estado').setValidators([Validators.required]);
      form['destinatario'].get('telefono').setValidators(config.telefono);
      switch (data) {
        case 'fedex':
          form['paquete'].get('comentario').setValidators(config.comentario);
          this.extraFedex = true;
          break;
        case 'dhl':
          console.log('si entro dhl');
          form['remitente'].get('referencia1').setValidators(config.referencia1);
          form['remitente'].get('referencia2').setValidators(config.referencia2);
          form['remitente'].get('correo').setValidators(config.correo);
          form['destinatario'].get('referencia1').setValidators(config.referencia1);
          form['destinatario'].get('referencia2').setValidators(config.referencia2);
          form['destinatario'].get('correo').setValidators(config.correo);
          form['paquete'].get('contenido').setValidators(config.contenido);
          this.extraDhl = true;
          console.log(this.extraDhl);
          // this.forma.controls['remitente'].get('nombre').updateValueAndValidity();
          break;
        case 'estafeta':
          form['paquete'].get('contenido').setValidators(config.contenido);
          break;
        case 'redpack':
          form['remitente'].get('numero').setValidators(config.numero);
          form['destinatario'].get('numero').setValidators(config.numero);
          this.extraRedpack = true;
          break;
        case 'paquetexpress':
          this.extraPaquetexpress = true;
          form['remitente'].get('correo').setValidators(config.correo);
          form['destinatario'].get('correo').setValidators(config.correo);
          break;
        case 'globalpaq':
          this.extraGlobalpaq = true;
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
    });

    this.estados = estados;
  }

  ngOnInit() {
    this.carga = true;
    this.cambiarPaqueteria('fedex');
    console.log('socket on')
    // this.wsSocket.checkStatus();
  }

  verForm() {
    console.log(this.forma);
  }

  addPaquete() {
    if (this.paquetes.controls.length >= 6) {
      return;
    }
    this.paquetes.push(
      new FormGroup({
        'largo': new FormControl('', Validators.required),
        'alto': new FormControl('', Validators.required),
        'ancho': new FormControl('', Validators.required),
        'peso': new FormControl('', Validators.required),
        'pesov': new FormControl({ value: '0', disabled: true }),
        'seguro': new FormControl('0')
      })
    )
  }

  deletePaquete(index) {
    this.paquetes.removeAt(index);
  }

  getRemitentes(paqueteria) {
    this.loadingRems = false;
    this.wsDireccion.getRemitentes(paqueteria).subscribe((data: any) => {
      console.log('remitentes', data);
      this.cantidadRem = data.cantidad;
      this.maximoRem = data.maximo;
      this.remitentes = data.data;
      console.log(this.cantidadRem >= this.maximoRem)
      if (this.cantidadRem >= this.maximoRem) {
        for (let i in this.forma.get('remitente')['controls']) {
          console.log('si entra')
          if (i != 'colonia' && i != 'correo' && i != 'referencia1' && i != 'referencia2' && i != 'numero') {
            this.forma.controls['remitente']['controls'][i].disable()
          }
        }
      } else {

      }
      this.loadingRems = true;
    });
  }

  cambiarPaqueteria(paqueteria) {
    this.paqueteria = paqueteria;
    this.forma.controls['datos'].get('paqueteria').setValue(this.paqueteria);
    this.forma.controls['datos'].get('pesoguia').reset();
    this.disponibles = [];
    this.forma.controls['datos'].get('tipoguia').reset();
    this.viewSeguro = true;
    this.forma.controls['remitente'].get('nombre').enable();
    this.forma.controls['remitente'].get('compania').enable();
    this.forma.controls['remitente'].get('telefono').enable();
    this.forma.controls['remitente'].get('calle').enable();
    this.forma.controls['remitente'].get('cp').enable();
    this.wsDireccion.getPredeterminados(this.forma.value.datos.paqueteria).subscribe((data: any) => {
      // console.log(data);
      if (this.idusuario == 128 || this.idusuario == 136 || this.idusuario == 238 || this.idusuario == 239) {
        if (data.data.predeterminado_r != false) {
          this.llenarCampos(data.data.predeterminado_r, 'remitente');
        }
      } else {
        this.getRemitentes(this.paqueteria);
      }
      if (data.data.predeterminado_d != false) {
        this.llenarCampos(data.data.predeterminado_d, 'destinatario');
      }
    });
    this.wsGlobal.getGuiasDisponibles(this.paqueteria).subscribe((data: any) => {
      console.log(data);
      this.diaSig = data.diaSig;
      this.terr = data.terrestre;
      this.llenarDisponibles(this.forma.value.datos.tipoguia);
      this.getAvisos(this.diaSig, this.terr);
    });
    if (paqueteria == 'estafeta') {
      this.viewSeguro = false;
      this.recoleccion = 0;
    }
    if (paqueteria == 'paquetexpress' || paqueteria == 'globalpaq') {
      this.viewSeguro = false;
    }
  }

  getAvisos(diaSig, terr) {
    this.avisos = [];
    this.alertGuias = false;
    this.wsAvisos.getAvisoPaq(this.paqueteria).subscribe((data: any) => {
      console.log(data)
      if (data.error) {
        return;
      }
      for (let i in data.data) {
        let guiasD = diaSig.filter(element => element.idarticulo == data.data[i].id_articulo && Number(element.disponibles) <= Number(data.data[i].minimo));
        if (guiasD.length >= 1) {
          this.avisos.push(...guiasD);
        }
        let guiasT = terr.filter(element => element.idarticulo == data.data[i].id_articulo && Number(element.disponibles) <= Number(data.data[i].minimo));
        if (guiasT.length >= 1) {
          this.avisos.push(...guiasT);
        }
      }
      if (this.avisos.length > 0) {
        this.alertGuias = true;
      } else {
        this.alertGuias = false;
      }
      console.log('avisos', this.avisos)
    });
  }

  generarGuia() {
    this.loadingGeneracion = true;
    let tipo = this.forma.value.datos.pesoguia.split('-')[0];
    if (tipo == 37 || tipo == 38 || tipo == 39 || tipo == 40) {
      if (tipo == 37) {
        if (this.forma.value.paquete.peso > 5) {
          this.generacionRobot();
        } else {
          this.generacionNormal();
        }
        return;
      }
      if (tipo == 38) {
        if (this.forma.value.paquete.peso > 1) {
          this.generacionRobot();
        } else {
          this.generacionNormal();
        }
        return;
      }
      this.generacionRobot();
      return;
    }
    this.generacionNormal();
  }


  generacionNormal() {
    this.loadingG = true;
    let sendData = guia(this.forma.getRawValue());
    // console.log(sendData);
    let paquetesAdicionales = [];
    if (this.forma.value.paquetes.length > 0) {
      for (let i in this.forma.value.paquetes) {
        let paquete = paqueteAdicional(this.forma.value.paquetes[i]);
        for (let j in paquete) {
          paquetesAdicionales[j + `${Number(i) + 1}`] = paquete[j];
        }
      }
      paquetesAdicionales['cantidadPaquetes'] = this.forma.value.paquetes.length + 1;
      console.log(paquetesAdicionales);
      sendData = { ...sendData, ...paquetesAdicionales };
    }
    console.log(sendData);
    // return;
    this.wsGlobal.generateTracking(this.forma.value.datos.paqueteria, sendData).subscribe((data: any) => {
      // console.log(data);
      this.loadingGeneracion = false;
      this.loadingG = false;
      data.idtipoguia = sendData.guia_tipo;
      data.paqueteria = this.forma.value.datos.paqueteria;
      data.tipoG = 'normal';
      if (data.error
      ) {
        this.openDialogGenerar(data, 'error', '');
        return;
      }

      if (this.forma.value.recoleccion.fecha != null) {
        let recData = recoleccion(this.forma.getRawValue(), data.data.tracking);
        this.wsGlobal.generateRecoleccion(this.forma.value.datos.paqueteria, recData).subscribe((dataRec: any) => {
          console.log('recoleccion', dataRec)
          if (dataRec.data.message) {
            this.openDialogGenerar(data, 'ok', 'error', dataRec);
            return;
          }
          this.openDialogGenerar(data, 'ok', 'ok', dataRec);
          return;
        });
        return;
      }
      this.openDialogGenerar(data, 'ok', '');
    })
  }

  generacionRobot() {
    this.loadingG = true;
    this.loadingGeneracion = true;
    let i = this.coloniasRemitente.findIndex(element => element.codigo == this.forma.getRawValue().remitente.cp && element.colonia == this.forma.value.remitente.colonia);
    console.log(this.forma.value.remitente.cp, this.forma.value.remitente.colonia)
    let ciudadRem = this.coloniasRemitente[i].ciudadRobot;

    console.log(this.coloniasDestinatario)
    let j = this.coloniasDestinatario.findIndex(element => element.codigo == this.forma.getRawValue().destinatario.cp && element.colonia == this.forma.value.destinatario.colonia);
    let ciudadDest = this.coloniasDestinatario[j].ciudadRobot;

    let sendData = guiaRobot(this.forma.getRawValue(), ciudadRem, ciudadDest);
    console.log(sendData);
    let urlSocket = '';
    let messageSocket = '';
    if (this.paqueteria == 'dhl') {
      urlSocket = environment.wsUrlDhl;
      messageSocket = 'enviarDatos2';

    }
    if (this.paqueteria == 'estafeta') {
      urlSocket = environment.wsUrlEstafeta;
      messageSocket = 'enviarDatos';

    }
    // debugger;
    let socket = new WebsocketService(urlSocket);
    socket.emitMessage(messageSocket, sendData, (resp) => {
      console.log('generando')
      console.log(resp);

    });
    this.openDialogGenerar({ tipoG: 'robot', paqueteria: this.paqueteria, idtipoguia: sendData.client_tipoguia, socket }, 'ok', '', undefined, 'robot');

  }

  setRemitente(remitente) {
    console.log(remitente);
    if (remitente == 0) {
      return;
    }
    let index = this.remitentes.findIndex(element => element.iddireccion == remitente);
    console.log(this.remitentes[index]);
    this.llenarCampos(this.remitentes[index], 'remitente');
    this.forma.controls['remitente'].get('nombre').disable();
    this.forma.controls['remitente'].get('compania').disable();
    this.forma.controls['remitente'].get('telefono').disable();
    this.forma.controls['remitente'].get('calle').disable();
    this.forma.controls['remitente'].get('cp').disable();
  }

  llenarDisponibles(tipoguia) {
    if (tipoguia == 1) {
      this.disponibles = this.diaSig;
    } else if (tipoguia == 2) {
      this.disponibles = this.terr
    }
  }

  noWeekends = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  }

  limpiarDatos(tipo) {

    switch (tipo) {
      case 'remitente':
        this.forma.get('remitente').reset();
        break;
      case 'destinatario':
        this.forma.get('destinatario').reset();
        break;
    }

  }

  openDialogDireccion(tipo: string): void {

    const dialogRef = this.dialog.open(DialogoDireccionComponent, {
      width: '800px',
      data: {
        tipo,
        tipoVista: 'buscarDireccion',
        paqueteria: this.forma.value.datos.paqueteria
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      if (result != undefined) {
        this.llenarCampos(result, tipo);
      }
      // this.forma['controls'][tipo].get('ciudad').setValue(result.ciudad);
      // this.forma['controls'][tipo].get('estado').setValue(result.estado);
    });
  }

  openDialogGenerar(data: any, tipoGuia: string, tipoRec: string, recoleccion?: any, generar?: any): void {

    const dialogRef = this.dialog.open(GenerarComponent, {
      width: '800px',
      data: {
        tipoGuia: tipoGuia,
        tipoRec: tipoRec,
        data,
        recoleccion,
        generar
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingG = false;
      this.loadingGeneracion = false;
      if (!result.ok) {
        return;
      }
      this.terminar.emit(true);
      this.forma.reset({
        paquete: {
          seguro: 0
        }
      });
      this.cambiarPaqueteria(this.paqueteria);
    });
  }


  eliminarPred(tipo) {
    this.wsDireccion.eliminarPred(tipo, this.forma.value.datos.paqueteria).subscribe((data: any) => {
      console.log(data);
    })
  }

  llenarCampos(data, tipo) {
    this.forma['controls'][tipo].get('nombre').setValue(data.nombre);
    this.forma['controls'][tipo].get('compania').setValue(data.compania);
    this.forma['controls'][tipo].get('telefono').setValue(data.telefono);
    this.forma['controls'][tipo].get('calle').setValue(data.direccion);
    this.forma['controls'][tipo].get('cp').setValue(data.cp);
    console.log('object')
    this.getCobertura('54435', this.forma['controls'][tipo].get('cp').value);
    // this.getZonaGlobalpaq();
    if (data.email) {
      this.forma['controls'][tipo].get('correo').setValue(data.email);
    }
    if (data.referencia1) {
      this.forma['controls'][tipo].get('referencia1').setValue(data.referencia1);
    }
    if (data.referencia2) {
      this.forma['controls'][tipo].get('referencia2').setValue(data.referencia2);
    }
    if (data.numero) {
      this.forma['controls'][tipo].get('numero').setValue(data.numero);
    }
  }

  sendCorreo(event) {
    if (!event) {
      this.forma.controls.adicional.get('correo').setValue('');
    } else {
      this.forma.controls.adicional.get('correo').setValue(this.correoAsociado);
    }
    this.forma.controls.adicional.get('correo').updateValueAndValidity();
  }

  sendSeguimiento(event) {
    if (!event) {
      this.forma.controls.adicional.get('seguimiento').setValue('');
    } else {
      this.forma.controls.adicional.get('seguimiento').setValue(this.correoAsociado);
    }
    this.forma.controls.adicional.get('seguimiento').updateValueAndValidity();
  }

  getCobertura(origen: string, destino: string) {
    if (destino.length >= 5) {
      this.wsGlobal.getCobertura(origen, destino, this.paqueteria).subscribe((data: any) => {
        console.log(data); 0
        if (data.error) {
          return;
        }
        this.newNotificacion(`Cobertura ${this.paqueteria.toUpperCase()}`, '', `El Codigo Postal ${destino} Es ${data.data.message}`, '', 20000);
      })
    }
  }

  getZonaGlobalpaq(origen: string, destino: string) {
    if (this.paqueteria != 'globalpaq') {
      return;
    }
    if (origen.length >= 5 && destino.length >= 5) {
      this.wsGlobal.getZonaGlobalpaq(origen, destino).subscribe((data: any) => {
        console.log(data)
        if (data.error) {
          this.newNotificacion('Zona Globalpaq', '', `No hay zona disponible`, '', 20000);
          return;
        }
        this.newNotificacion('Zona Globalpaq', '', `Zona: ${data.data.zona}<br>Tarifa: $${data.data.tarifa}`, '', 20000);
      })
      return;
    }
  }

  newNotificacion(titulo: string, date: string, html: string, icon: string, time: number) {
    let noti: Notificacion = {
      id: `${Math.random() * (1000 - 1) + 1}_${moment().format('YYYYMMDDHHmmss')}`,
      titulo,
      activo: true,
      date,
      html,
      time,
      icon
    }
    this.wsNotificacion.newNotificacion(noti);
  }

  getSeguro(monto, i, tipo) {
    this.wsAsociado.getSeguro(Number(monto), this.paqueteria).subscribe((data: any) => {
      console.log(data);
      if (data.error) {
        return;
      }
      if (tipo == 'first') {
        this.montoFirst = 0;
        if (monto > 0) {
          this.montoFirst = data.data.monto
        }
      } else {
        this.montoSeguro[i] = 0;
        if (monto > 0) {
          this.montoSeguro[i] = data.data.monto;
        }
      }
    });
  }



}
