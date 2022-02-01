import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedService {

  constructor(public jwtHelper: JwtHelperService,
    private wsLogin: LoginService,
    private router: Router) { }

  isAuthenticated(): boolean {
    const token:any = localStorage.getItem('token');
    // console.log('token auth', typeof token)
    if (token && token !== 'undefined') {
      // console.log('entra?')
      if (!this.jwtHelper.isTokenExpired(token)) {
        this.wsLogin.refreshToken(token).subscribe((data: any) => {
          // console.log('token nuevo', data)
          if (data.err) {
            this.wsLogin.loginView
            localStorage.removeItem('token');
            return false;
          }
          console.log('actualizando token');
          localStorage.setItem('token', data.data.token);
          return true;
        })
        return true;
      }
      this.wsLogin.loginView = false;
      localStorage.removeItem('token');
      return !this.jwtHelper.isTokenExpired(token);
    }
    localStorage.removeItem('token');
    this.wsLogin.loginView = false;
    return false;
  }

  activate() {
    if (!this.isAuthenticated()) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

}