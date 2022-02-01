import { Router, RouterModule} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { EnvioComponent } from './components/envio/envio.component';
import { HistorialComponent } from './components/historial/historial.component';
import { CotizarComponent } from './components/cotizar/cotizar.component';
import { TiendaComponent } from './components/tienda/tienda.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { CoberturaComponent } from './components/cobertura/cobertura.component';
import { DatosComponent } from './components/asociado/datos/datos.component';
import { CuentaComponent } from './components/asociado/cuenta/cuenta.component';
import { AclaracionesComponent } from './components/aclaraciones/aclaraciones.component';
import { DireccionesComponent } from './components/direcciones/direcciones.component';
import { CuponesComponent } from './components/cupones/cupones.component';
import { DevolucionGuiaComponent } from './components/devolucion-guia/devolucion-guia.component';
import { CreacionAvisosComponent } from './components/creacion-avisos/creacion-avisos.component';
import { ApiComponent } from './components/api/api.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';
import { VerMasComponent } from './components/ver-mas/ver-mas.component';
import { RestComponent } from './components/rest/rest.component';
import { MaterialEnvioComponent } from './components/material-envio/material-envio.component';
import { DevolucionMasivaComponent } from './components/devolucion-masiva/devolucion-masiva.component';
import { AclaracionCobranzaComponent } from './components/aclaracion-cobranza/aclaracion-cobranza.component';
import { MultiusuarioComponent } from './components/multiusuario/multiusuario.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { FormasPagoComponent } from './components/formas-pago/formas-pago.component';
import { RecoleccionesComponent } from './components/recolecciones/recolecciones.component';
import { OpinionComponent } from './components/opinion/opinion.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthGuardLoginService } from './auth/auth-guard-login.service';

const ROUTES = [
    {path: 'login', component: LoginComponent, canActivate: [AuthGuardLoginService]},
    {path: 'inicio', component: InicioComponent, canActivate: [AuthGuardService]},
    {path: 'envio', component: EnvioComponent, canActivate: [AuthGuardService]},
    {path: 'direcciones', component: DireccionesComponent, canActivate: [AuthGuardService]},
    {path: 'cotizar', component: CotizarComponent, canActivate: [AuthGuardService]},
    {path: 'tienda', component: TiendaComponent, canActivate: [AuthGuardService]},
    {path: 'carrito', component: CarritoComponent, canActivate: [AuthGuardService]},
    {path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuardService]},
    {path: 'movimientos', component: MovimientosComponent, canActivate: [AuthGuardService]},
    {path: 'pedido/:id', component: PedidoComponent, canActivate: [AuthGuardService]},
    {path: 'historial', component: HistorialComponent, canActivate: [AuthGuardService]},
    {path: 'cobertura', component: CoberturaComponent, canActivate: [AuthGuardService]},
    {path: 'datos-usuario', component: DatosComponent, canActivate: [AuthGuardService]},
    {path: 'estado-cuenta', component: CuentaComponent, canActivate: [AuthGuardService]},
    {path: 'aclaraciones', component: AclaracionesComponent, canActivate: [AuthGuardService]},
    {path: 'cupones', component: CuponesComponent, canActivate: [AuthGuardService]},
    {path: 'devolucion-guia', component:DevolucionGuiaComponent, canActivate: [AuthGuardService]},
    {path: 'creacion-avisos', component: CreacionAvisosComponent, canActivate: [AuthGuardService]},
    {path: 'api', component: ApiComponent, canActivate: [AuthGuardService]},
    {path: 'ayuda', component: AyudaComponent, canActivate: [AuthGuardService]},
    {path: 'ver', component: VerMasComponent, canActivate: [AuthGuardService]},
    {path: 'restaurar', component: RestComponent },
    {path: 'material-envio', component: MaterialEnvioComponent },
    {path: 'cancelacion-masiva', component: DevolucionMasivaComponent},
    {path: 'aclaracion-cobranza',component: AclaracionCobranzaComponent},
    {path: 'usuarios-adicionales', component: MultiusuarioComponent},
    {path: 'usuarios-adicionales/:id', component: UsuarioComponent},
    {path: 'formas-pago', component: FormasPagoComponent},
    {path: 'recolecciones', component: RecoleccionesComponent},
    {path: 'recolecciones/:paqueteria', component: RecoleccionesComponent},
    {path: 'aclaracion-cobranza',component: AclaracionCobranzaComponent},
    {path: 'opinion',component: OpinionComponent},
    {path: '**', pathMatch: 'full', redirectTo: 'login'}
];

export const APP_ROUTES = RouterModule.forRoot(ROUTES, { relativeLinkResolution: 'legacy' });