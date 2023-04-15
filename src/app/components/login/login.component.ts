import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  route: string = '';
  email: string;
  header: string;
  image: string;
  errors: string = '';

  isLoggedIn: boolean = false;
  isLoading: boolean = false;

  constructor(private _auth: AuthService, private _router: Router, private _activatedRoute: ActivatedRoute, private _cookieService:CookieService) {
    this.route = this._activatedRoute.snapshot.routeConfig.path;
    if (this.route == 'admin/login') {
      this.email = 'Admin Email';
      this.header = 'Welcome To Admin Panel';
      this.image = 'adminlogin.png'
    }
    else if (this.route == 'user/login') {
      this.email = 'User Email';
      this.header = 'Time to get lost in a book!';
      this.image = 'login-img.png'

    }
  }


  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required])
  })
  
  submitLoginForm(loginForm: FormGroup) {
    if (this.route == 'admin/login') {
      this._auth.loginAdmin(loginForm.value).subscribe({
        next: (res) => {
          console.log("ana token",res.token);
            
          this._cookieService.delete('token');
          
          // localStorage.removeItem('token');
          this._cookieService.set('token', res.token),
          // console.log("ana token",res.body.token);
          // // localStorage.setItem('token', res.token)
          this._auth.saveCurrentUser();
          this._router.navigate(['admin/books']);
          // this.isLoggedIn = true;
          // this.isLoading = false;
          // else {
          //   //throw error
          //   this.errors = "Authentication failed"
          // }
        },
        error: (err) => {
          this.errors = err.error.error
        },
      })
    } else if (this.route == 'user/login') {
      this.isLoading = true;
      this._auth.userLogin(loginForm.value).subscribe({
        next: (res) => {
          console.log("ana token",res.token);
            
          this._cookieService.delete('token');
          
          // localStorage.removeItem('token');
          this._cookieService.set('token', res.token),
          // console.log("ana token",res.body.token);
          // // localStorage.setItem('token', res.token)
          this._auth.saveCurrentUser();
          this._router.navigate(['user/books']);
          this.isLoggedIn = true;
          this.isLoading = false;
        },
        error: (err) => {
          this.errors = err.error.error
          this.isLoading = false;
        }
      })
    }

  }

}
