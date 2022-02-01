import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GlobalpaqService } from '../../../services/globalpaq.service';
import { TiendaService } from 'src/app/services/tienda.service';
import { MultiusuarioService } from 'src/app/services/multiusuario.service';

interface status {
  Events?: {
    EventDescription: string,
    Timestamp: string,

  },
  ShipmentInfo?: any
}

@Component({
  selector: 'app-dialogo-info',
  templateUrl: './dialogo-info.component.html',
  styleUrls: ['./dialogo-info.component.css']
})
export class DialogoInfoComponent implements OnInit {

  status: status;
  mensaje: string;
  loading: boolean = false;
  factPdf: any[];
  factXml: any[];
  isFactura: boolean = false;
  reContenido: any[] = [];
  reComentarios: any[] = [];
  tracksH:any;

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gp: GlobalpaqService,
    private wsTienda: TiendaService,
    private wsMulti: MultiusuarioService) {



    console.log(this.reContenido);

    switch (data.tipoVista) {
      case 'tracking':
        if (data.paqueteria == "fedex" && data.tracking.indexOf('CANCEL') < 0) {
          this.loading = false;
          this.gp.getStatusTracking(data.tracking, data.paqueteria).subscribe(data => {
            console.log(data);
            this.status = data;
            this.loading = true;
          });
        } else if (data.paqueteria == "dhl" && data.tracking.indexOf('CANCEL') < 0) {
          this.loading = false;
          this.gp.getStatusTracking(data.tracking, data.paqueteria).subscribe(data => {
            console.log(data.AWBInfo);
            if (Array.isArray(data.AWBInfo)) {
              this.status = data.AWBInfo[1];
              this.loading = true;
            } else {
              this.status = data.AWBInfo;
              this.loading = true;
            }

          });
        } else {
          this.status = {
            Events: {
              EventDescription: "No hay información disponible",
              Timestamp: ""
            },
          };
          this.loading = true;
        }
        break;
      case 'cancelar':
        this.loading = false;
        this.gp.cancelarGuia(data.tracking, data.paqueteria).subscribe(data => {
          this.mensaje = data.message;
          this.loading = true;
        });
        break;
      case 'factura':
        console.log(data.id);
        this.wsTienda.getFactura(data.id).subscribe((data: any) => {
          this.factPdf = data.pdf;
          this.factXml = data.xml;
          if (this.factPdf.length <= 0 && this.factXml.length <= 0) {
            this.isFactura = true;
          }
          console.log(data);
        })
        break;
      case 'verReclamos':
        for (let i in this.data.reclamo.contenido) {
          this.reContenido.push(i);
        }
        break;
      default:
        break;
    }
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  verFactura(factura: string) {
    window.location.href = `https://sistema.globalpaq.mx/facturas/${factura}`;
  }

  borrar() {
    let sendData = {
      idtipoguia: this.data.idtipoguia,
      peso: this.data.peso,
      cantidad: -Number(this.data.disponibles),
      idusuario: this.data.idusuario
    }
    this.wsMulti.agregarGuia(sendData).subscribe((data:any) => {
      console.log(data);
      if(data.error){
        this.onNoClick();
        return;
      } 
      this.dialogRef.close({ok: true, item: this.data});
    });
  }

  verGuiasHijo(guias:string){
    this.tracksH = JSON.parse(guias);
  }

  borrarGuia(tracking){
    let i = this.data.guias
  }



}
