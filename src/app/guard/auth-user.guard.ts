import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthuserGuard implements CanActivate {
  constructor(private _auth:AuthService, private _router:Router, private _activatedRoute: ActivatedRoute){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this._auth.currentUser.getValue() != null){
        if(this._auth.currentUser.getValue().role === 'user'){
          return true;
        }
        alert('not authorized')
        this._router.navigate(['/admin/books']);
        return false;
      }
      else {
        this._router.navigate(['/user/login']);
        return false;
      }
  }
  
}
