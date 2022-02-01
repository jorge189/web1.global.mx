import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { estados } from 'src/app/classes/estados';
import { recoleccion } from 'src/app/classes/guia';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { GlobalpaqService } from 'src/app/services/globalpaq.service';
import { DialogoInfoComponent } from '../../dialogos/dialogo-info/dialogo-info.component';

@Component({
  selector: 'app-globalpaq',
  templateUrl: './globalpaq.component.html',
  styleUrls: ['./globalpaq.component.css']
})
export class GlobalpaqComponent implements OnInit {

  cantidad: number = 4;
  paginaActiva: number = 1;
  carga: boolean;
  search: string = '';
  totalPaginas: number;
  paginas: any[] = [];
  init: boolean = false;
  loading: boolean = false;
  disponibles: any[] = [];
  error: boolean = false;
  errMsg: string = '';
  agregadas: any[] = [];
  forma: FormGroup;
  estados: any[];
  coloniasRemitente: any;
  loading2: boolean = false;
  okMsg: string = '';

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  @Input() paqueteria: string = 'globalpaq';

  constructor(private wsGlobal: GlobalpaqService,
    private snack: MatSnackBar,
    private modal: MatDialog,
    private wsDireccion: DireccionesService) {
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
    this.getPendientes(1, this.cantidad)
    let x = JSON.parse(localStorage.getItem('recoleccionGlobalpaq'))
    this.agregarGuia(x, true);
  }

  async getPendientes(pagina: number = 1, cantidad) {
    this.carga = true;
    this.disponibles = [];
    this.loading = true;
    this.error = false;
    this.wsGlobal.getPendientes(pagina, cantidad).subscribe((data: any) => {
      this.loading = false;
      if (data.error) {
        this.error = true;
        this.errMsg = data.message;
        this.paginas = [];
        return;
      }
      for (let i in data.data) {
        let j = this.agregadas.findIndex(element => element.tracking == data.data[i].tracking);
        if (j >= 0) {
          data.data[i].agregado = true;
        }
      }
      this.disponibles = data.data;
      if (this.init == false) {
        this.init = true;
        this.totalPaginas = Math.ceil(data.total / this.cantidad);
        this.paginas = [];
        this.paginaActiva = 1;
      } else {
        return;
      }
      for (let i = 1; i <= this.totalPaginas; i++) {
        if (i > 5) {
          return;
        }
        this.paginas.push(i);
      }
    });
  }

  async verPagina(pagina) {
    if (this.paginaActiva == pagina) {
      return;
    }
    this.paginaActiva = pagina;
    await this.getPendientes(pagina, this.cantidad);
    if (this.totalPaginas <= 5) {
      return;
    }
    this.paginas = [];
    if (pagina >= 3 && this.totalPaginas > 5 && pagina < this.totalPaginas - 1) {
      for (let i = pagina - 2; i <= pagina + 2; i++) {
        this.paginas.push(i);
      }
    }
    if (pagina >= 3 && this.totalPaginas > 5 && pagina == this.totalPaginas - 1) {
      for (let i = pagina - 3; i <= pagina + 1; i++) {
        this.paginas.push(i);
      }
    }
    if (pagina == 2 && this.totalPaginas > 5 && pagina < this.totalPaginas - 1) {
      for (let i = pagina - 1; i <= pagina + 3; i++) {
        this.paginas.push(i);
      }
    }

    if (pagina == this.totalPaginas && this.totalPaginas > 5) {
      for (let i = pagina - 4; i <= pagina; i++) {
        this.paginas.push(i);
      }
    }

    if (pagina == 1 && this.totalPaginas > 5) {
      for (let i = pagina; i <= pagina + 4; i++) {
        this.paginas.push(i);
      }
    }

  }

  agregarGuia(item, remoto = false) {
    console.log(item, 'desde funcion agregar guia');
    if (item.codigo != null) {
      if (moment().startOf('day').diff(moment(item.fecha_recoleccion)) == 0) {
        this.openSnackBar('La guia ya no se puede agregar', 'Entendido');
        return
      }
      if (moment().add(1, 'day').startOf('day').diff(moment(item.fecha_recoleccion)) == 0 && moment().diff(moment().startOf('day').add(16, 'hours')) >= 0) {
        this.openSnackBar('La guia ya no se puede agregar', 'Entendido');
        return
      }
    }
    let i = this.agregadas.findIndex(element => element.tracking == item.tracking);
    if (i >= 0) {
      return;
    }
    if (!remoto) {
      let index = this.disponibles.findIndex(element => element.tracking == item.tracking);
      this.disponibles[index].agregado = true;
    }
    this.agregadas.push(item);
    if (this.agregadas.length == 1) {
      this.wsDireccion.getDireccionGlobal(item.id_rem, 'globalpaq').subscribe((data: any) => {
        if (data.error) {
          return;
        }
        this.llenarCampos(data.data, 'remitente');
      });
    }
    // this.openSnackBar(`La guia ${item.tracking} fue agregada`, 'Ok');
  }

  openSnackBar(message: string, action: string) {
    this.snack.open(message, action, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

  verGuias() {
    const dialogRef = this.modal.open(DialogoInfoComponent, {
      width: '600px',
      data: {
        tipoVista: 'guiasGlobalpaq',
        guias: this.agregadas
      }
    })
  }


  borrarGuia(tracking) {
    let i = this.agregadas.findIndex(element => element.tracking == tracking);
    this.agregadas.splice(i, 1);
    let j = this.disponibles.findIndex(element => element.tracking == tracking);
    this.disponibles[j].agregado = false;
  }

  llenarCampos(data, tipo) {
    this.forma['controls'][tipo].get('nombre').setValue(data.nombre);
    this.forma['controls'][tipo].get('compania').setValue(data.compania);
    this.forma['controls'][tipo].get('telefono').setValue(data.telefono);
    this.forma['controls'][tipo].get('calle').setValue(data.direccion);
    this.forma['controls'][tipo].get('cp').setValue(data.cp);
  }

  noWeekends = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  }

  generarRecoleccion() {
    let trackings = [];
    for (let item of this.agregadas) {
      trackings.push(item.tracking)
    }
    const sendData = recoleccion(this.forma.value, trackings.join(','));
    this.loading2 = true;
    this.wsGlobal.generateRecoleccion('globalpaq', sendData).subscribe((data: any) => {
      this.loading2 = false;
      if (data.error) {
        this.errMsg = data.message;
        return;
      }
      this.agregadas = [];
      this.forma.reset();
      this.okMsg = `Recolección generada correctamente <br> Fecha de Recolección: ${data.data.recoleccion}`;
      setTimeout(() => {
        this.okMsg = '';
      }, 8000);
    })
  }


}
