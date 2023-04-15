import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CBAService } from 'src/app/services/cba.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

  id:string = this._ActivatedRoute.snapshot.params['id'];

  currentPage:number = 1;
  pageSize:number = 2;
  books:any = [];
  option:any = [];
  category:any;
  constructor(private _CBAService: CBAService, private _ActivatedRoute: ActivatedRoute) {    
    this.getBooksByCategory()
  }


  getBooksByCategory(){
    this._CBAService.getByID('categories', this.id,`?page=${this.currentPage}&limit=${this.pageSize}`).subscribe((res) => {
      if (res.status == 200) {
        this.books=res.body.data.book.docs;
        this.category=res.body.data.cate;
        const {docs, ...paginate}=res.body.data.book;
        this.option=paginate;        
      };
    })
  }  

  nextPage(){
    if(this.option.hasNextPage) {
      this.currentPage++;
      this.getBooksByCategory()
    }
  }
  prevPage(){
    if(this.option.hasPrevPage) {      
      this.currentPage--;
      this.getBooksByCategory()
    }
  }
}
