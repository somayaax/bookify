import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CBAService } from 'src/app/services/cba.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  adminIsLogin:boolean = false;
  userIsLogin:boolean = false;

  constructor(private _auth:AuthService, private _CBAService:CBAService){
    this._auth.currentUser.subscribe(() => {
      if(_auth.currentUser.getValue()!= null && this._auth.currentUser.getValue().role === 'admin') {
        this.adminIsLogin = true;
      }
      else {
        this.adminIsLogin = false;
      }
    })

    this._auth.currentUser.subscribe(() => {
      if(_auth.currentUser.getValue()!= null && this._auth.currentUser.getValue().role === 'user') {
        this.userIsLogin = true;
      }
      else {
        this.userIsLogin = false;
      }
    })
  } 

  adminLogOut(){
    this._auth.logOut();
  }

  userLogOut(){
    this._auth.userLogOut();
  }

  searchKey:string ='';
  bookSearch = [];
  close:Boolean = false;
  search(){
    this.close=false
    if (this.searchKey.length > 2) {
      this._CBAService.getCBA('book', 1, 5, `&key=${this.searchKey}`).subscribe((res)=>{
        this.bookSearch = res.body.books.docs;
      })   
    }else{
      this.bookSearch = []
    }
  }
  closeRes(){
    this.close= true
  }
  activateSearch() {
    const searchInput = document.querySelector('.form-control') as HTMLInputElement;
    searchInput.focus();
  }
}
