import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { data } from 'jquery';
import { LoginService } from 'src/app/services/login.service';
import { Router } from "@angular/router";
import { AuthenticatedService } from 'src/app/auth/authenticated.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-rest',
  templateUrl: './rest.component.html',
  styleUrls: ['./rest.component.css'],

})
export class RestComponent implements OnInit {
  resp: any = [];
  valores: string = window.location.search;
  urlParams: any = "";
  vista: boolean = true
  constructor(private _snackBar: MatSnackBar, private wsLogin: LoginService, private ruta: Router, public jwtHelper: JwtHelperService) { }
  recuperar(pass: string, confirm: string) {

    var espacios = false;
    var cont = 0;
    this.urlParams = new URLSearchParams(this.valores);
    var tokens = this.urlParams.get('token');
    while (!espacios && (cont < pass.length)) {
      if (pass.charAt(cont) == " ")
        espacios = true;
      cont++;
    }
    if (espacios) {
      this.openSnackBar("La contraseña no puede contener espacios en blanco");
      return false;
    }
    if (pass === confirm && !espacios) {
      this.wsLogin.restaurar(tokens, confirm).subscribe((data: any) => {
        this.resp = data.data
        if (this.resp == 1) {
          this.openSnackBar("La contraseña a sido actualizada");
          setTimeout(() => {
            this.ruta.navigate(['/login'])
          }, 2000)
          return
        } else {
          this.openSnackBar("No se pudo actualizar el registro");
        }
      });
    }
    else {
      this.openSnackBar("las contraseñas no coinciden");
    }
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'cerrar', {
      duration: 3000,
    });
  }
  ngOnInit() {
    this.urlParams = new URLSearchParams(this.valores);
    var tokens = this.urlParams.get('token');
    if (!this.jwtHelper.isTokenExpired(tokens)) {

      if (tokens == null || this.resp.catidad == 0) {
        this.vista = false
      }
      console.log(this.resp);
    };





  }



}
