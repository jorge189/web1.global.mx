import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticatedService } from './authenticated.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardLoginService {

  constructor(public auth: AuthenticatedService, public router: Router) { }

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/inicio']);
      return false;
    }
    return true;
  }

}