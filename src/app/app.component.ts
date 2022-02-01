import { Component, OnInit, Inject } from '@angular/core';
import { TiendaService } from './services/tienda.service';
import { AsociadoService } from './services/asociado.service';
import { LoginService } from './services/login.service';
import { environment } from '../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticatedService } from './auth/authenticated.service';
// import { DOCUMENT } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'globalpaq';
  sidebar: boolean = false;
  login: boolean = false;
  abrirMenu: boolean = false;
  info: any;
  cantidadCarrito: number = 0;
  idasociado: number;
  nombre: string;
  acces: boolean = false;


  constructor(private gp: AsociadoService,
    public wsTienda: TiendaService,
    public wsLogin: LoginService,
    public active: ActivatedRoute,
    private router: Router,
    private location: Location,
    private auth: AuthenticatedService
  ) {


  }



  ngOnInit() {
    var URLactual = window.location.href;
    var url = new URL(URLactual);
    // console.log(url.href);
    if (url.href.includes("http://localhost:4200/restaurar")) {
      // console.log("estas en restaurar ");
      this.sidebar = true;
      this.acces = true;
      return
    }


    if (this.acces == false) {

      // this.wsLogin.validarLogin();

      this.wsLogin.loginView = this.auth.activate();
      this.login = this.wsLogin.loginView;
      console.log(this.login)

    }
    if (this.login) {
      // this.sidebar = !this.sidebar;
    }

    if (window.innerWidth < 989) {
      this.sidebar = true;
    }
    this.gp.getInfoAsociado().subscribe((data: any) => {
      this.info = data;
      console.log('info', this.info)
    });

    this.wsTienda.getCarrito().subscribe((data: any) => {
      this.cantidadCarrito = this.wsTienda.cantidad;
    });

    this.getAsociado();


  }

  abrirBarra() {
    console.log(window.innerWidth)
    if (window.innerWidth < 989) {
      this.sidebar = !this.sidebar;
    }
  }

  getAsociado() {
    this.idasociado = (localStorage.getItem('idasociado')) as any;
    this.nombre = localStorage.getItem('nombre');

  }

  cerrarSesion() {

    localStorage.removeItem('token');
    localStorage.removeItem('idasociado');
    localStorage.removeItem('nombre');
    this.sidebar = true;
    this.acces = true;
    window.location.href = 'login';



  }

}
