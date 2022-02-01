import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatDialogRef, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { Observable } from 'rxjs';
import { MultiusuarioService } from 'src/app/services/multiusuario.service';

interface ErrorValidate{
  [s: string]: boolean
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})


export class NuevoUsuarioComponent implements OnInit {

  forma: FormGroup;
  matcher = new MyErrorStateMatcher();
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  loading:boolean = false;

  constructor(public dialogRef: MatDialogRef<any>,
    private wsMulti: MultiusuarioService,
    private snackBar: MatSnackBar) { 
    this.forma = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'usuario': new FormControl('', Validators.required, this.validarUserName.bind(this)),
      'correo': new FormControl('', [Validators.required, Validators.email]),
      'correoR': new FormControl(''),
      'pass': new FormControl('', Validators.required),
      'passR': new FormControl('')
    });

    this.forma.controls['correoR'].setValidators([
      Validators.required,
      this.validarEmail.bind(this)
    ]);

    this.forma.controls['passR'].setValidators([
      Validators.required,
      this.validarPass.bind(this)
    ]);

  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close({ok: false});
  }
  
  agregar(){
    console.log(this.forma);
    let sendData = {
      nombre: this.forma.value.nombre,
      usuario: this.forma.value.usuario,
      correo: this.forma.value.correo,
      password: this.forma.value.pass
    }
    this.loading = true;
    this.wsMulti.addUsuario(sendData).subscribe((data:any) => {
      this.loading = false;
      console.log(data);
      if(data.error){
        this.msgSnack('No se logro agregar el usuario');
        this.onNoClick();
        return;
      }
      this.msgSnack('Usuario agregado correctamente');
      this.dialogRef.close({ok: true})
    });
  }

  validarEmail(control: FormControl): ErrorValidate {
    // console.log(this.forma)
    if (control.value !== this.forma.controls['correo'].value) {
      return { error: true };
    }

    return null;
  }

  validarPass(control: FormControl): ErrorValidate {

    if (control.value !== this.forma.controls['pass'].value) {
      return { error: true };
    }

    return null;
  }

  validarUserName(control: FormControl): Promise<ErrorValidate> | Observable<ErrorValidate>{
    return new Promise((resolve, reject) => {
      this.wsMulti.validarUsuario(control.value).subscribe((data:any) => {
        console.log(this)
        if(data.error){
          resolve({existe: true});
          return;
        }
        resolve(null);
      });
    });
  }

  msgSnack(message:string){
      this.snackBar.open(message, 'Ok',{
        duration: 5000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      });
  }

}
