import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { AsociadoService } from 'src/app/services/asociado.service';
import { estados } from '../../../classes/estados';

export class stateError implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-dialogo-asociado',
  templateUrl: './dialogo-asociado.component.html',
  styleUrls: ['./dialogo-asociado.component.css']
})

export class DialogoAsociadoComponent implements OnInit {
  matcher = new stateError();
  forma: FormGroup;
  newDatos: any[];
  loading: boolean = false;
  codigoValido: boolean = false;
  estadosData: any[];
  razonSocial: any;

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private wsAsociado: AsociadoService) {
    this.forma = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'correoC': new FormControl('', Validators.required),
      'telefono': new FormControl('', [Validators.required, Validators.pattern('^[0-9]+'), Validators.minLength(5)], this.validarTelefono.bind(this)),
      'telefono2': new FormControl('', [Validators.required, Validators.pattern('^[0-9]+'), Validators.minLength(5)], this.validarTelefono.bind(this)),
      'direccion': new FormControl('', Validators.required),
      'cp': new FormControl('', Validators.required),
      'colonia': new FormControl('', Validators.required),
      'ciudad': new FormControl('', Validators.required),
      'estado': new FormControl('', Validators.required),
      'codigo': new FormControl('', Validators.required)
    });
    console.log(this.forma);
    this.estadosData = estados;
  }

  ngOnInit() {
    this.wsAsociado.getRazones().subscribe((data: any) => {
      this.razonSocial = data;
    });
  }



  enviarDatos(dato: string) {
    this.loading = true;
    this.newDatos = this.data.info;
    this.newDatos[dato] = this.forma.value[dato];
    this.wsAsociado.setInfoAsociado(this.newDatos).subscribe((data: any) => {
      this.dialogRef.close(data);
      this.loading = false;
    });
  }

  validarTelefono(control: FormControl): Promise<any> | Observable<any> {
    let promesa = new Promise((resolve, reject) => {
      this.wsAsociado.validarTelefono(control.value).subscribe((data: any) => {
        if (data.existe) {
          resolve({ existe: true });
          return;
        }
        resolve(null);
        return;
      });
    });

    return promesa;
  }

  enviarCodigo(tipo) {
    let datos = {
      codigo: this.forma.value.codigo,
      tipo
    }
    this.loading = true;
    this.wsAsociado.validarCodigo(datos).subscribe((data: any) => {
      console.log(data);
      this.loading = false;
      if (!data.validado) {
        this.codigoValido = true;
        return;
      }
      let telActivo = (tipo == 1) ? 'tel_activo' : 'tel_activo2';
      this.data.info[telActivo] = 1;
      this.dialogRef.close(this.data.info);
    });

    console.log(this.forma);
  }

  cambiarRazon(id:number){
    console.log('id', id);
    this.wsAsociado.setRazon(id).subscribe((data:any) => {
      let razon = this.razonSocial.find(element => element.id == id);
      console.log(data);
      this.dialogRef.close({razon});
    });
  }

 

}
