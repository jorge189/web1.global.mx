import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticatedService } from './authenticated.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthenticatedService,
    public router: Router) { }

  canActivate(): boolean {
    return this.auth.activate();
  }

}