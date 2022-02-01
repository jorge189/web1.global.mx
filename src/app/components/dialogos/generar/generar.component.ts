import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { LinksPipe } from 'src/app/pipes/links.pipe';
import { GlobalpaqService } from 'src/app/services/globalpaq.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-generar',
  templateUrl: './generar.component.html',
  styleUrls: ['./generar.component.css']
})
export class GenerarComponent implements OnInit {

  guiaOk: boolean = false;
  msgErrorGuia: string = '';
  recOk: any;
  msgErrorRec: string = '';
  correo: boolean = false;
  btnEmail: boolean = true;
  msgEmail: string = '';
  generar: string
  guiaROk: boolean = false;
  guiaRErr: boolean = false;
  guiaRErrMsg: string = '';
  cargando: boolean = false;
  porcentaje: string;
  auxPorc: number;
  tracking: string;

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private wsGlobal: GlobalpaqService,
    // private socket:WebsocketService,
    private link: LinksPipe) { }

  ngOnInit() {
    console.log('data', this.data['data']);
    this.guiaOk = this.data.tipoGuia == 'ok' ? true: false;
    if(!this.guiaOk){
      console.log('paqueteria', this.data)
      if(this.data.data.paqueteria == 'fedex'){
        this.msgErrorGuia = this.data.data.data.Message;
      }else{
        this.msgErrorGuia = this.data['data']['data'] ? this.data['data']['data'].message : this.data['data'].message;
      }
    }else{
      this.msgErrorGuia = this.data['data']['data'] ? this.data['data']['data'].message : this.data['data'].message;
    }
    this.recOk = this.data.tipoRec == '' ? null : (this.data.tipoRec == 'ok') ? true : false;
    this.msgErrorRec = this.data.data.message ? this.data.data.message : 'Error';
    this.generar = this.data.generar;
    console.log(this.msgErrorGuia);
    if(this.data.generar == 'robot'){
      this.porcentaje = '0%';
      this.auxPorc = 0;
      this.cargando = true;
      let urlSocket = '';
      let  messageSocket = '';
      if(this.data.data.paqueteria == 'dhl'){
        urlSocket = environment.wsUrlDhl
        // messageSocket = ''
      }
      if(this.data.data.paqueteria == 'estafeta'){
        urlSocket = environment.wsUrlEstafeta
      }
      console.log(urlSocket)
      // let socket = new WebsocketService(urlSocket);
      this.data.data.socket.onMessage('enviarMensaje', (resp) => {
        console.log(resp)
        this.auxPorc += resp.porc;
        this.porcentaje = `${this.auxPorc}%`;
        console.log(this.porcentaje);
        if(resp.evento == 'salir'){
            this.guiaRErr = true;
            this.guiaRErrMsg = resp.evento;
            this.cargando = false;
            return;
        }
        if(resp.evento == 'finalizar'){
          setTimeout(() => {
            this.guiaROk = true;
            this.tracking = resp.tracking;
            this.cargando = false;
          }, 1000);
        }
      });
    }
  }

  onNoClick(event){
    this.dialogRef.close({ok: event});
  }

  irEnvios(){
    this.dialogRef.close(0);
    this.router.navigate(['/historial']);
  }

  abrirEnvio(){
    this.correo = true;
    console.log('abierto');
  }

  enviarGuia(email){
    let href = this.link.transform(this.data.data.tipoG, this.data.data.paqueteria, this.data.data.data.label, (this.data.data.data.tracking || this.tracking), (this.data.data.idtipoguia || 0));
    console.log(href)
    this.wsGlobal.sendGuiaByEmail(href, email).subscribe((data: any) => {
      console.log(data);
      this.btnEmail = false;
      this.msgEmail = "Guia enviada correctamente";
    });
  }

}
