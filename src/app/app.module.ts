
import { AyudaComponent } from './components/ayuda/ayuda.component';
import { VerMasComponent } from './components/ver-mas/ver-mas.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

//Material Angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatMenuModule} from '@angular/material';




//Servicio http
import { HttpClientModule } from '@angular/common/http';

//ROUTES
import { APP_ROUTES } from './app.routes';

//Formulario
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Dialogos
import { DialogoDetalleComponent} from './components/dialogos/dialogo-detalle/dialogo-detalle.component';
import { DialogoInfoComponent } from './components/dialogos/dialogo-info/dialogo-info.component';
 
//Components
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/shared/nav/nav.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { EnvioComponent } from './components/envio/envio.component';
import { HistorialComponent } from './components/historial/historial.component';
import { CotizarComponent } from './components/cotizar/cotizar.component';
import { TiendaComponent } from './components/tienda/tienda.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { IsArrayPipe } from './pipes/is-array.pipe';
import { TablaHistorialComponent } from './components/shared/tabla-historial/tabla-historial.component';
import { CutinfoPipe } from './pipes/cutinfo.pipe';
import { PaginarPipe } from './pipes/paginar.pipe';
import { UrlPipe } from './pipes/url.pipe';
import { ImgPipe } from './pipes/img.pipe';
import { PedidoComponent } from './components/pedido/pedido.component';
import { DialogoPagosComponent } from './components/dialogos/dialogo-pagos/dialogo-pagos.component';
import { FileControlValueDirective } from './directives/file-control-value.directive';
import { CoberturaComponent } from './components/cobertura/cobertura.component';
import { DatosComponent } from './components/asociado/datos/datos.component';
import { DialogoAsociadoComponent } from './components/dialogos/dialogo-asociado/dialogo-asociado.component';
import { EstadosPipe } from './pipes/estados.pipe';
import { CuentaComponent } from './components/asociado/cuenta/cuenta.component';
import { ZonaPipe } from './pipes/zona.pipe';
import { ListaComponent } from './components/lista/lista.component';
import { AclaracionesComponent } from './components/aclaraciones/aclaraciones.component';
import { StatusReclamosPipe } from './pipes/status-reclamos.pipe';
import { DialogoReclamoComponent } from './components/dialogos/dialogo-reclamo/dialogo-reclamo.component';
import { ToastComponent } from './components/shared/toast/toast.component';
import { DialogoDireccionComponent } from './components/dialogos/dialogo-direccion/dialogo-direccion.component';
import { DireccionesComponent } from './components/direcciones/direcciones.component';
import { NuevaDireccionComponent } from './components/direcciones/nueva-direccion/nueva-direccion.component';
import { VerDireccionComponent } from './components/direcciones/ver-direccion/ver-direccion.component';
import { GenerarComponent } from './components/dialogos/generar/generar.component';
import { LinksPipe } from './pipes/links.pipe';
import { TipsComponent } from './components/shared/tips/tips.component';
import { ImgtipsPipe } from './pipes/imgtips.pipe';
import { CuponesComponent } from './components/cupones/cupones.component';
import { CrearCuponComponent } from './components/shared/crear-cupon/crear-cupon.component';
import { VerCuponComponent } from './components/shared/ver-cupon/ver-cupon.component';
import { ApiComponent } from './components/api/api.component';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { DevolucionGuiaComponent } from './components/devolucion-guia/devolucion-guia.component';
import { CreacionAvisosComponent } from './components/creacion-avisos/creacion-avisos.component';
import { DevolucionesComponent } from './components/dialogos/devoluciones/devoluciones.component';
import { ApisComponent } from './components/dialogos/apis/apis.component';
import { environment } from 'src/environments/environment';
import { DialogoForwardPassComponent } from './components/dialogos/dialogo-forward-pass/dialogo-forward-pass.component';
import { RestComponent } from './components/rest/rest.component';


//--- Socket
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MaterialEnvioComponent } from './components/material-envio/material-envio.component';
import { TablaAvisosComponent } from './components/shared/tabla-avisos/tabla-avisos.component';
import { DialogoAvisosComponent } from './components/dialogos/dialogo-avisos/dialogo-avisos.component';
import { DevolucionMasivaComponent } from './components/devolucion-masiva/devolucion-masiva.component';
import { NotificacionComponent } from './components/notificacion/notificacion.component';
import { MultiusuarioComponent } from './components/multiusuario/multiusuario.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { AsignacionesUsuarioComponent } from './components/shared/asignaciones-usuario/asignaciones-usuario.component';
import { DisponiblesUsuarioComponent } from './components/shared/disponibles-usuario/disponibles-usuario.component';
import { NuevoUsuarioComponent } from './components/dialogos/nuevo-usuario/nuevo-usuario.component';
import { FormasPagoComponent } from './components/formas-pago/formas-pago.component';
import { MetodoPagoComponent } from './components/dialogos/metodo-pago/metodo-pago.component';
import { PrepagoComponent } from './components/shared/prepago/prepago.component';
import { LinkReclamoPipe } from './pipes/link-reclamo.pipe';
import { RecoleccionesComponent } from './components/recolecciones/recolecciones.component';
import { NormalComponent } from './components/recolecciones/normal/normal.component';
import { GlobalpaqComponent } from './components/recolecciones/globalpaq/globalpaq.component';
import { AclaracionCobranzaComponent } from './components/aclaracion-cobranza/aclaracion-cobranza.component';
import { DialogoCobranzaComponent } from './components/dialogos/dialogo-cobranza/dialogo-cobranza.component';
import { TablaAclaracionCobranzaComponent } from './components/shared/tabla-aclaracion-cobranza/tabla-aclaracion-cobranza.component';
import { DialogoCobranzabComponent } from './components/dialogos/dialogo-cobranzab/dialogo-cobranzab.component';
import { CarouselComponent } from './components/shared/carousel/carousel.component';
import { StylePipe } from './pipes/style.pipe';
import { OpinionComponent } from './components/opinion/opinion.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { environment } from '../environments/environment';
const config: SocketIoConfig = { url: environment.wsUrlEstafeta, options: {} };

export function getToken() {
  return JSON.parse(localStorage.getItem('user') || '').token;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent,
    FooterComponent,
    InicioComponent,
    EnvioComponent,
    HistorialComponent,
    CotizarComponent,
    DialogoDetalleComponent,
    TiendaComponent,
    CarritoComponent,
    PedidosComponent,
    MovimientosComponent,
    IsArrayPipe,
    TablaHistorialComponent,
    CutinfoPipe,
    PaginarPipe,
    UrlPipe,
    DialogoInfoComponent,
    ImgPipe,
    PedidoComponent,
    DialogoPagosComponent,
    FileControlValueDirective,
    CoberturaComponent,
    DatosComponent,
    DialogoAsociadoComponent,
    EstadosPipe,
    CuentaComponent,
    ZonaPipe,
    ListaComponent,
    AclaracionesComponent,
    StatusReclamosPipe,
    DialogoReclamoComponent,
    ToastComponent,
    DialogoDireccionComponent,
    DireccionesComponent,
    NuevaDireccionComponent,
    VerDireccionComponent,
    GenerarComponent,
    LinksPipe,
    TipsComponent,
    ImgtipsPipe,
    CuponesComponent,
    CrearCuponComponent,
    VerCuponComponent,
    ApiComponent,
    NumbersOnlyDirective,
    DevolucionGuiaComponent,
    CreacionAvisosComponent,
    DevolucionesComponent,
    ApisComponent,
    AyudaComponent,
    VerMasComponent,
    DialogoForwardPassComponent,
    RestComponent,
    MaterialEnvioComponent,
    TablaAvisosComponent,
    DialogoAvisosComponent,
    DevolucionMasivaComponent,
    AclaracionCobranzaComponent,
    DialogoCobranzaComponent,
    TablaAclaracionCobranzaComponent,
    DialogoCobranzabComponent,
    NotificacionComponent,
    MultiusuarioComponent,
    UsuarioComponent,
    AsignacionesUsuarioComponent,
    DisponiblesUsuarioComponent,
    NuevoUsuarioComponent,
    FormasPagoComponent,
    MetodoPagoComponent,
    PrepagoComponent,
    LinkReclamoPipe,
    RecoleccionesComponent,
    NormalComponent,
    GlobalpaqComponent,
    AclaracionCobranzaComponent,
    DialogoCobranzaComponent,
    TablaAclaracionCobranzaComponent,
    DialogoCobranzabComponent,
    CarouselComponent,
    StylePipe,
    OpinionComponent
  ],
  entryComponents: [
    DialogoDetalleComponent ,
    DialogoInfoComponent,
    DialogoPagosComponent,
    DialogoAsociadoComponent,
    DialogoReclamoComponent,
    DialogoDireccionComponent,
    GenerarComponent,
    DevolucionesComponent,
    ApisComponent,
    DialogoAvisosComponent,
    DialogoCobranzaComponent,
    DialogoCobranzabComponent,
    DialogoForwardPassComponent,
    DialogoAvisosComponent,
    NuevoUsuarioComponent,
    MetodoPagoComponent,
    DialogoAvisosComponent,
    DialogoCobranzaComponent,
    DialogoCobranzabComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    APP_ROUTES,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    BrowserModule,
    MatMenuModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
