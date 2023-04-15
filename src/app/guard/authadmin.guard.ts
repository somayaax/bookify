import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthadminGuard implements CanActivate {

  constructor(private _auth:AuthService, private _router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this._auth.currentUser.getValue() != null){
        if(this._auth.currentUser.getValue().role === 'admin'){
          return true;
        }
        alert('not authorized')
        this._router.navigate(['/user/books']);
        return false;
      }
      else {
        this._router.navigate(['/admin/login']);
        return false;
      }
  }
  
}
