import { Component } from '@angular/core';
import { CBAService } from 'src/app/services/cba.service';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss']
})
export class AllCategoriesComponent {
  currentPage: number = 1;
  limit: number = 8;
  categories: any = []
  popcategories: any = []
  catRes: any = []
  keyParam: string = '';
  constructor(private _CBAService: CBAService) {
    this.getBooks()
    this._CBAService.getPopularCBA('categories').subscribe(
      (res) => { 
        this.popcategories = res.body.categories; console.log(res) 
      }
    )
  }

  getBooks() {
    this._CBAService.getCBA('categories', this.currentPage, this.limit).subscribe((res) => {
      console.log(res);
      if (res.status === 200) {
        this.categories = res.body.category.docs;
        this.catRes = res.body.category;
      }
    });
   
  }

  nextPage() {
    if (this.catRes.hasNextPage) {
      this.currentPage++;
      this.getBooks()
    }
  }
  prevPage() {
    if (this.catRes.hasPrevPage) {
      this.currentPage--;
      this.getBooks()
    }
  }
}
