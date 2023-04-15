import { Component } from '@angular/core';
import { CBAService } from '../../services/cba.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-allbooks',
  templateUrl: './allbooks.component.html',
  styleUrls: ['./allbooks.component.scss']
})
export class AllbooksComponent {
  currentPage: number = 1;
  limit: number = 8;
  books: any = []
  booksRes: any = []
  keyParam: string = '';
  constructor(private _CBAService: CBAService, private _ActivatedRoute: ActivatedRoute) {
    this._ActivatedRoute.queryParams.subscribe(params => {
      this.keyParam = params['key'] || '';
      this.getBooks()
    });
    this.getBooks()
  }

  getBooks() {
    this._CBAService.getCBA('book', this.currentPage, this.limit, `&key=${this.keyParam}`).subscribe((res) => {
      console.log(res);
      if (res.status === 200) {
        
        this.books = res.body.books.docs;
        this.booksRes = res.body.books;
      }
    });
  }

  nextPage() {
    if (this.booksRes.hasNextPage) {
      this.currentPage++;
      this.getBooks()
    }
  }
  prevPage() {
    if (this.booksRes.hasPrevPage) {
      this.currentPage--;
      this.getBooks()
    }
  }

}
