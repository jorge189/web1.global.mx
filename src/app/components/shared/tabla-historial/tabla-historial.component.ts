import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { GlobalpaqService } from '../../../services/globalpaq.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogoInfoComponent } from '../../dialogos/dialogo-info/dialogo-info.component';
import { DialogoReclamoComponent } from '../../dialogos/dialogo-reclamo/dialogo-reclamo.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tabla-historial',
  templateUrl: './tabla-historial.component.html',
  styleUrls: ['./tabla-historial.component.css']
})
export class TablaHistorialComponent implements OnInit, OnChanges {

  @Input() paqueteria: string = "";
  loading: boolean = false;
  selected: string = "7";
  forma: FormGroup;
  formb: FormGroup;
  opcionFecha: boolean = false;
  historial: any[] = [];
  dataGlobalpaq: any[] = [];
  disabled: boolean = false;
  resto: number;
  contenedor: Element;
  iconExport: boolean = false;
  totalPaginas: number;
  totalPaginas2: number;
  paginaActiva: number = 1;
  paginaActiva2: number = 1;
  paginas: any[] = [];
  paginas2: any[] = [];
  search: string = '';
  init: boolean = false;
  init2: boolean = false;
  totalRegistros: number;
  totalRegistros2: number;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  value = '';
  cPagina = '5'
  selectStatus = '0'
  initB = ''
  endB = ''

  constructor(private gp: GlobalpaqService, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar, private router: Router) {
    this.forma = new FormGroup({
      'dias': new FormControl('', Validators.required),
      'inicio': new FormControl(''),
      'fin': new FormControl(''),
      'registros': new FormControl('5', Validators.required)
    });
  }
  ngOnInit() {
    this.contenedor = document.getElementById('histori');
  }

  ngOnChanges() {
    this.loading = false;
  }

  cambiar(fecha) {
    if (fecha == 0) {
      this.opcionFecha = true;
    } else {
      this.opcionFecha = false;
    }
  }

  openDialogCancelar(tracking: string) {
    const dialogRef = this.dialog.open(DialogoInfoComponent, {
      data: {
        tracking,
        paqueteria: this.paqueteria,
        tipoVista: "cancelar"
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == "El envio se cancelo satisfactoriamente.<br> Ya esta disponible su guia!!") {
        let i = this.historial.findIndex(guia => guia.tracking == tracking);
        this.historial[i].statusenvio = 5;
        this.historial[i].tracking += "CANCEL";
      }
    });
  }

  cargarTabla() {
    if (this.paqueteria != 'globalpaq') {
      this.init = false;
      this.getHistorial()
    }
  }
  async enviosGlobalpaq() {
    await this.historialGlobalpaq(1, this.value, false);
  }

  async enviosGlobalpaqFile() {
    await this.historialGlobalpaq(1, this.value, true);
  }
  async historialGlobalpaq(pagina = 1, search = '', file: boolean) {
    this.loading = true;
    let inicio = '';
    let fin = ''
    if (this.initB == '') {
      inicio = '2000-01-01'
    } else { inicio = this.initB }
    if (this.endB == '') {
      fin = moment().format('YYYY-MM-DD')
    } else { fin = this.endB }
    if (file) {
      console.log('si entro')
      this.gp.getHistorialGlobalpaqFile({
        pagina: pagina,
        cantidad: Number(this.cPagina),
        status: Number(this.selectStatus),
        fecha_inicio: inicio,
        fecha_fin: fin,
        search: search,
        file: 'ok'
      }).subscribe((data: any) => {
        if (data.error) {
          return;
        }
        let file = this.b64toBlob(data.data.historial)
        let date = new Date();
        let a = document.createElement('a');
        document.body.appendChild(a);
        let url = URL.createObjectURL(file);
        a.target = '_self';
        a.download = `Historial${this.paqueteria}_${date.getFullYear()}${date.getMonth() + 1}${date.getDay()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
        // window.open(this.UrlFileExport);
        a.href = url;
        a.click();
        this.iconExport = false;
        // window.URL.revokeObjectURL(url);
      });
      return;
    }
    this.gp.getHistorialGlobalpaq({
      pagina: pagina,
      cantidad: Number(this.cPagina),
      status: Number(this.selectStatus),
      fecha_inicio: inicio,
      fecha_fin: fin,
      search: search,
    }).subscribe((data: any) => {

      if (data.error) {
        return;
      }
      this.dataGlobalpaq = data.data;

      for (let ind = 0; ind < this.dataGlobalpaq.length; ind++) {
        const element = this.dataGlobalpaq[ind];

        if (element.fecha_recoleccion) {
          if (element.fecha_recoleccion.split('T')[0] == moment().format('YYYY-MM-DD')) {
            this.dataGlobalpaq[ind]['recoleccion_now'] = true
            alert(element.tracking)
          }
        } else {
          this.dataGlobalpaq[ind]['recoleccion_now'] = false
        }
      }

      this.totalPaginas2 = Math.ceil(Number(data.total) / Number(this.cPagina));
      if (this.init2 == false) {
        this.init2 = true;
        this.paginas2 = [];
        this.totalRegistros2 = data.total
        this.paginaActiva2 = 1;
      } else {
        return;
      }
      for (let i = 1; i <= this.totalPaginas2; i++) {
        if (i > 5) {
          return;
        }
        this.paginas2.push(i);
      }
    })
  }

  async getHistorial(pagina: number = 1, search: string = '') {
    this.historial = [];
    this.loading = false;
    this.gp.getHistorial(this.forma.value.dias, this.forma.value.inicio, this.forma.value.fin, this.paqueteria, pagina, this.forma.value.registros, search).subscribe((data: any) => {
      this.loading = true;
      if (data.error) {
        return;
      }
      this.historial = data.data;

      if (this.init == false) {
        this.init = true;
        this.totalPaginas = Math.ceil(Number(data.total) / Number(this.forma.value.registros));
        this.paginas = [];
        this.totalRegistros = data.total
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
    await this.getHistorial(pagina, this.search);
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
  async verPagina2(pagina) {
    if (this.paginaActiva2 == pagina) {
      return;
    }
    this.paginaActiva2 = pagina;
    await this.historialGlobalpaq(pagina, this.value, false);
    if (this.totalPaginas2 <= 5) {
      return;
    }
    this.paginas2 = [];
    if (pagina >= 3 && this.totalPaginas2 > 5 && pagina < this.totalPaginas2 - 1) {
      for (let i = pagina - 2; i <= pagina + 2; i++) {
        this.paginas2.push(i);
      }
    }
    if (pagina >= 3 && this.totalPaginas2 > 5 && pagina == this.totalPaginas2 - 1) {
      for (let i = pagina - 3; i <= pagina + 1; i++) {
        this.paginas2.push(i);
      }
    }
    if (pagina == 2 && this.totalPaginas2 > 5 && pagina < this.totalPaginas2 - 1) {
      for (let i = pagina - 1; i <= pagina + 3; i++) {
        this.paginas2.push(i);
      }
    }

    if (pagina == this.totalPaginas2 && this.totalPaginas2 > 5) {
      for (let i = pagina - 4; i <= pagina; i++) {
        this.paginas2.push(i);
      }
    }

    if (pagina == 1 && this.totalPaginas2 > 5) {
      for (let i = pagina; i <= pagina + 4; i++) {
        this.paginas2.push(i);
      }
    }
  }

  openDialogDetalles(info: any): void {

    const dialogRef = this.dialog.open(DialogoInfoComponent, {
      width: '400px',
      data: {
        fecha: info.fecha,
        tracking: info.tracking,
        nombrer: info.nombrer,
        nombred: info.nombred,
        tipo: info.tipoguia,
        peso: info.pesoguia,
        idusuario: info.idusuario,
        status: info.statusenvio,
        comentario: info.comentario,
        tipoVista: "detalles",
        ...info
      }
    });
  }

  openDialogTracking(tracking: string): void {

    const dialogRef = this.dialog.open(DialogoInfoComponent, {
      width: '500px',
      data: {
        tracking,
        tipoVista: "tracking",
        paqueteria: this.paqueteria
      }
    });
  }

  confirmacionCancelar(tracking: string): void {
    const dialogRef = this.dialog.open(DialogoInfoComponent, {
      width: '300px',
      data: {
        tracking,
        paqueteria: this.paqueteria,
        tipoVista: 'confirmarCancelar'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.openDialogCancelar(tracking);
      }
    });
  }

  exportarHistorial() {
    this.iconExport = true;
    this.gp.getHistorialFile(this.forma.value.dias, this.forma.value.inicio, this.forma.value.fin, this.paqueteria).subscribe((data: Blob) => {
      let date = new Date();
      let a = document.createElement('a');
      document.body.appendChild(a);
      let url = URL.createObjectURL(data);
      a.target = '_self';
      a.download = `Historial${this.paqueteria}_${date.getFullYear()}${date.getMonth() + 1}${date.getDay()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
      // window.open(this.UrlFileExport);
      a.href = url;
      a.click();
      this.iconExport = false;
      // window.URL.revokeObjectURL(url);
    });

  }

  getTipoGuia(idtipoguia: number, tipoguia: string, peso: number) {
    if (tipoguia.includes('FEDEX') || tipoguia.includes('REDPACK')) {
      return 'normal';
    }
    if (idtipoguia == 20 || idtipoguia == 21 || idtipoguia == 31) {
      return 'normal';
    }
    if (idtipoguia == 37) {
      if (peso <= 5) {
        return 'normal';
      }
      return '';
    }
    if (idtipoguia == 38) {
      if (peso <= 1) {
        return 'normal'
      }
      return '';
    }
    else {
      return '';
    }
  }

  nuevoReclamo(tracking: string) {
    const dialogRef = this.dialog.open(DialogoReclamoComponent, {
      width: '900px',
      data: {
        tipo: 'atc',
        paqueteria: this.paqueteria,
        tracking
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.openSnackBar('Aclaración enviada correctamente!', 'CERRAR');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 8000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

  navigationUrl(guia) {
    window.open(environment.wsUrlGlobalpaq + '/guia/file/' + guia, '_blank'); // in new tab
  };
  rastreo(guia) {
    window.open('https://rastreo.globalpaq.mx/globalpaq/' + guia, '_blank'); // in new tab
  }
  cancel(guia, i) {
    // console.log(i);

    this.gp.cancelGlobalpaq(guia).subscribe((data: any) => {

      if (!data.error) {

        this.dataGlobalpaq[i].status = 6;
        this.openSnackBar('Guia cancelada Correctamente', 'CERRAR')
      } else {
        // console.log(data);
        this.openSnackBar('Error al cancelar su guia por favor intente mas tarde', 'CERRAR')

      }
    })
  }
  saveDataStorage(data) {
    // console.log(JSON.stringify(data));
    localStorage.setItem('recoleccionGlobalpaq', JSON.stringify(data))


    this.router.navigateByUrl('/recolecciones/globalpaq')
  }

  b64toBlob(dataURI) {
    // console.log(dataURI)
    // const padding = '';
    // const base64 = (dataURI + padding).replace(/-/g, '+').replace(/_/g, '/');

    // const rawData = window.atob(base64);
    // const outputArray = new Uint8Array(rawData.length);

    // for (let i = 0; i < rawData.length; ++i) {
    //     outputArray[i] = rawData.charCodeAt(i);
    // }
    // console.log(outputArray);
    // var arr = dataURI.split(','),
    //         mime = arr[0].match(/:(.*?);/)[1],
    //         bstr = atob(arr[1]),
    //         n = bstr.length,
    //         u8arr = new Uint8Array(n);

    //     while(n--){
    //         u8arr[n] = bstr.charCodeAt(n);
    //     }
    // console.log(u8arr)
    const buf = Buffer.from(dataURI, 'base64');
    console.log(buf)
    return new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}
