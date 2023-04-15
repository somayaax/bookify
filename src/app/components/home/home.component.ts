import { Component } from '@angular/core';
// import { FloatNumberPipe } from 'src/app/pipes/float-number.pipe';
import { CBAService } from 'src/app/services/cba.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  currentPage:number = 1;
  limit:number = 10;
  books:any[];
  authors:any[];
  categories:any[];

  constructor(private _cbaService:CBAService ){
    this._cbaService.getPopularCBA('book').subscribe({
      next:(res) => {this.books = res.body.books, console.log("ana hena",res.status)},
      error:(err) => console.error('Error while getting books in the home component'),
      complete:() => console.info('Complete')
    })

    this._cbaService.getPopularCBA('author').subscribe({
      next:(res) => this.authors = res.body.authors,
      error:(err) => console.error('Error while getting authors in the home component'),
      complete:() => console.info('Complete')
    })
  }

}
