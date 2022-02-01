import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReclamosService } from 'src/app/services/reclamos.service';

@Component({
  selector: 'app-dialogo-reclamo',
  templateUrl: './dialogo-reclamo.component.html',
  styleUrls: ['./dialogo-reclamo.component.css']
})
export class DialogoReclamoComponent implements OnInit {

  send: boolean = false;
  loading: boolean = false;
  forma: FormGroup = null;
  onlytracking: boolean = false;
  trackDirecc: boolean = false;
  indemnizacion: boolean = false;
  banco: boolean = false;
  damage: boolean = false;
  cobranza: boolean = false;

  destinatario: boolean = false;
  tipo: number = 0;
  reclamos: any[] = [];
  aux: any[] = [];

  constructor(private wsReclamo: ReclamosService,
    private wsReclamos: ReclamosService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.wsReclamos.getTiposReclamos(this.data.tipo).subscribe((data: any) => {
      this.reclamos = data;
      this.aux = data;
      console.log(this.reclamos);

    });
    this.forma = new FormGroup({
      'paqueteria': new FormControl('', Validators.required),
      'tracking': new FormControl('', Validators.required),
      'remitente': new FormControl({ value: '', disabled: true }, [Validators.required]),
      'destinatario': new FormControl({ value: '', disabled: true }, Validators.required),
      'tiporeclamo': new FormControl('', Validators.required),
      'onlytracking': new FormGroup({
        'guia': new FormControl(null)
      }),
      'trackDirecc': new FormGroup({
        'guia': new FormControl(null),
        'direccion': new FormControl('')
      }),
      'indemnizacion': new FormGroup({
        'guia': new FormControl(null),
        'seguro': new FormControl(''),
        'monto': new FormControl(''),
        'transferencia': new FormControl(''),
        'factura': new FormControl(null)
      }),
      'banco': new FormGroup({
        'tipo': new FormControl(''),
        'titular': new FormControl(''),
        'cuenta': new FormControl(''),
        'clave': new FormControl('')
      }),
      'damage': new FormGroup({
        'fotoext1': new FormControl(null),
        'fotoext2': new FormControl(null),
        'fotoint1': new FormControl(null),
        'fotoint2': new FormControl(null)
      }),
      'cobranza': new FormGroup({
        'guia': new FormControl(null),
        'info': new FormControl('')
      })
    });

    this.forma.get('paqueteria').valueChanges.subscribe(value => {
      console.log(value);
      if (this.data.tipo === 'cbz') {
        console.log('hacer el cambio');
        this.reclamos = this.aux.filter(elemento => elemento.descripcion.indexOf(value) >= 0);
        console.log(this.reclamos);
        for (let i in this.reclamos) {
          this.reclamos[i]['descripcion'] = this.reclamos[i]['descripcion'].replace(value, '');
        }
      }
    });

    this.forma.get('indemnizacion').valueChanges.subscribe(value => {
      console.log(value);
      // console.log(control);
      if (value.transferencia == "1") {
        console.log('si entros');
        this.banco = true;
        for (let i in this.forma.controls['banco']['controls']) {
          this.forma.controls['banco'].get(i).setValidators([Validators.required]);
          this.forma.controls['banco'].get(i).updateValueAndValidity();
        }
      } else {
        this.banco = false;
        // console.log('no entro');
        for (let i in this.forma.controls['banco']['controls']) {
          this.forma.controls['banco'].get(i).clearValidators();
          this.forma.controls['banco'].get(i).reset();
          this.forma.controls['banco'].get(i).updateValueAndValidity();
        }

      }
    })

  }

  ngOnInit() {
    if(this.data.tracking){
      this.forma.get('paqueteria').setValue(this.data.paqueteria.toUpperCase());
      console.log(this.data.tracking)
      this.forma.get('tracking').setValue(this.data.tracking.toUpperCase());
      this.forma.get('paqueteria').updateValueAndValidity();
      this.forma.get('tracking').updateValueAndValidity();
      this.getDirecciones();
    }
  }


  validar(tipo) {
    // for (let i in this.forma.controls) {
    //   this.forma.controls[i].updateValueAndValidity({ emitEvent: false });
    // }
    for (let i in this.forma.controls) {
      for (let j in this.forma.get(i)['controls']) {
        this.forma.controls[i].get(j).clearValidators();
        this.forma.controls[i].get(j).updateValueAndValidity();
        this.forma.controls[i].get(j).setValue(null);
      }
    }

    if (this.data.tipo == 'cbz') {
      this.cobranza = true;
      for (let i in this.forma.get('cobranza')['controls']) {
        this.forma.controls['cobranza'].get(i).setValidators([Validators.required]);
        this.forma.controls['cobranza'].get(i).setValue(null);
      }
      this.forma.get('cobranza').updateValueAndValidity();
      return;
    }
    console.log(tipo);
    let reclamo = this.reclamos.find(elemento => elemento.idtipo == tipo);
    console.log(reclamo);
    console.log(this.forma);
    this.onlytracking = false;
    this.trackDirecc = false;
    this.indemnizacion = false;
    this.banco = false;
    this.damage = false;
    this.cobranza = false;
    if (reclamo.activo) {
      if (reclamo.onlytracking == 1) {
        this.onlytracking = true;
        for (let i in this.forma.get('onlytracking')['controls']) {
          this.forma.controls['onlytracking'].get(i).setValidators([Validators.required]);
          this.forma.controls['onlytracking'].get(i).setValue(null);
        }
        this.forma.get('onlytracking').updateValueAndValidity();
      }
      if (reclamo.trackDirecc == 1) {
        this.trackDirecc = true;
        for (let i in this.forma.get('trackDirecc')['controls']) {
          this.forma.controls['trackDirecc'].get(i).setValidators([Validators.required]);
          this.forma.controls['trackDirecc'].get(i).setValue(null);
        }
        this.forma.get('trackDirecc').updateValueAndValidity();
      }
      if (reclamo.indemnizacion == 1) {
        this.indemnizacion = true;
        for (let i in this.forma.get('indemnizacion')['controls']) {
          this.forma.controls['indemnizacion'].get(i).setValidators([Validators.required]);
          this.forma.controls['indemnizacion'].get(i).setValue(null);
        }
        this.forma.get('indemnizacion').updateValueAndValidity();
      }
      if (reclamo.damage == 1) {
        this.damage = true;
        for (let i in this.forma.get('damage')['controls']) {
          this.forma.controls['damage'].get(i).setValidators([Validators.required]);
          this.forma.controls['damage'].get(i).setValue(null);
        }
        this.forma.get('damage').updateValueAndValidity();
      }
    }
  }

  enviarAclaracion() {

    console.log(JSON.stringify(this.forma.getRawValue()));
    // return;

    this.send = true;
    console.log(this.forma);
    let datos = new FormData();
    datos.append('area', this.data.tipo);
    for (let i in this.forma.getRawValue()) {
      if (typeof this.forma.getRawValue()[i] === 'object') {
        for (let j in this.forma.getRawValue()[i]) {
          if (typeof this.forma.getRawValue()[i][j] === 'object') {
            if (this.forma.getRawValue()[i][j] != null) {
              // console.log('file', this.forma.getRawValue()[i][j]);
              datos.append(j, this.forma.getRawValue()[i][j][0]);
            } else {
              // datos.append(j, this.forma.getRawValue()[i][j]);
            }
          } else {
            datos.append(j, this.forma.getRawValue()[i][j]);
          }
        }
      } else {
        if(this.forma.getRawValue()[i] != null){
          datos.append(i, this.forma.getRawValue()[i]);
        }
      }
    }
    console.log(datos);
    this.wsReclamo.postReclamos(datos).subscribe(data => {
      console.log(data);
      this.send = false;
      if(data.data.insertado){
          this.forma.reset();
          this.onNoClick(1);
      }
    })

  }

  getDirecciones() {
    console.log(this.forma);
    this.wsReclamo.getDirecciones(this.forma.value.paqueteria, this.forma.value.tracking).subscribe((data: any) => {
      console.log(data.remitente);
      let remitente = '';
      let destinatario = '';
      for (let item in data.remitente) {
        remitente += data.remitente[item] + ', ';
      }
      for (let item in data.destinatario) {
        destinatario += data.destinatario[item] + ', ';
      }
      this.forma.get('remitente').setValue(remitente.toUpperCase());
      this.forma.get('destinatario').setValue(destinatario.toUpperCase());
      console.log(remitente);
    });
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.file && event.target.file.length) {
      const [file] = event.target.file;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.forma.patchValue({
          guia: reader.result
        })
      }
      // console.log(reader.result);
    }
  }

  onNoClick(result:number = 0): void {
    this.dialogRef.close(result);
  }


}
