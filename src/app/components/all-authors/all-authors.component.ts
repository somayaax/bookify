import { Component } from '@angular/core';
import { CBAService } from 'src/app/services/cba.service';

@Component({
  selector: 'app-all-authors',
  templateUrl: './all-authors.component.html',
  styleUrls: ['./all-authors.component.scss']
})
export class AllAuthorsComponent {
  currentPage:number = 1;
  limit:number = 8;
  authors:any = []
  authorsRes:any = []
  constructor(private _CBAService: CBAService) {
    this.getAuthors()
  }
  
  getAuthors(){
    this._CBAService.getCBA('author', this.currentPage, this.limit).subscribe((res) => {
      if (res.status === 200) {
        this.authors = res.body.authors.docs;
        this.authorsRes = res.body.authors;
        console.log("this is authors res", res.books);
      }
    });
  }

  nextPage(){
    if(this.authorsRes.hasNextPage) {
      this.currentPage++;
      this.getAuthors()
    }
  }
  prevPage(){
    if(this.authorsRes.hasPrevPage) {      
      this.currentPage--;
      this.getAuthors()
    }
  }


}
