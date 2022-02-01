import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogoForwardPassComponent } from '../dialogos/dialogo-forward-pass/dialogo-forward-pass.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppComponent } from 'src/app/app.component';
// import { RestComponent } from '../rest/rest.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  
})
export class LoginComponent implements OnInit {

  forma: FormGroup;
  error:boolean = false;
  message:string;
  correo:string;
  erro:string="correo no valido"

  constructor(private wsLogin:LoginService,public dialog: MatDialog,private _snackBar: MatSnackBar,private app: AppComponent) {
    this.forma = new FormGroup({
      'correo' : new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
   }

  ngOnInit() {
   this.app.sidebar=true 
  }

  login(){
    console.log(this.forma);
    this.wsLogin.ingresar(this.forma.value.correo, this.forma.value.password).subscribe((data:any) => {
      console.log(data);
      if(data.err){
        this.error = true;
        this.message = data.data.message;
        this.forma.reset();
        return;
      }
      this.error = false;
      this.message = '';
      this.wsLogin.guardarSesion(data.data);
      this.wsLogin.loginView = false;
    });
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'cerrar', {
      duration: 3000,
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogoForwardPassComponent, {
      data:{
      correo: this.correo
      }
     
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.correo = result;
      // console.log(result);
     
      let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      if (emailRegex.test(this.correo)){
        // console.log(result);
        this.wsLogin.forgotPass(this.correo).subscribe((data:any) => {
         if (data.data == "No hay registros") {
           this.openSnackBar("Correo no registrado o no valido")
         }
         else{
           this.openSnackBar("Se enviara un correo a :" + this.correo );

         }
        });
        
        } else if (this.correo == undefined || !emailRegex.test(this.correo) ) {
        return
        }
        else{
        console.log("correo no valido")
         this.openSnackBar(this.erro);
        }
      
    // this.openSnackBar(this.correo);
    // console.log(this.correo);
  });
}
}