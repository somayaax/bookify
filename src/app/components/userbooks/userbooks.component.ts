import { Component, EventEmitter } from '@angular/core';
import { CBAService } from 'src/app/services/cba.service';

@Component({
  selector: 'app-userbooks',
  templateUrl: './userbooks.component.html',
  styleUrls: ['./userbooks.component.scss']
})

export class UserbooksComponent {
  currentPage:number = 1;
  limit:number = 5;
  shelf:string='';
  books:any = []
  option:any = []


  constructor(private _CBAService: CBAService) {
    this.getBooks()
  }

  getBooks(){
    this._CBAService.getCBA('user/book', this.currentPage, this.limit,`&shelf=${this.shelf}`).subscribe((res) => {      
      if (res.status == 200) {        
        this.option = res.body.data.option;
        this.books = res.body.data.docs;
      }
    });
  }

  onTabChange(event: any) {
    if(event.index===0){
      this.shelf='';
      this.getBooks();
      return ;
    }

    if(event.index===1){
      this.shelf='read';
      this.getBooks();
      return ;
    }

    if(event.index===2){
      this.shelf='currently reading';
      this.getBooks();
      return ;
    }

    if(event.index===3){
      this.shelf='want to read';
      this.getBooks();
      return ;
    }
  }

  get math() {
    return Math;
  }
  floor(value: number) {
    return this.math.floor(value);
  }

  ceil(value: number) {
    return this.math.ceil(value);
  }



  nextPage(){
    if(this.option.hasNextPage) {
      this.currentPage=this.option.nextPage;
      this.getBooks()
    }
  }
  prevPage(){
    if(this.option.hasPrevPage) {      
      this.currentPage=this.option.prevPage;
      this.getBooks();
    }
  }
  stars: { filled: boolean, hover: boolean }[] = Array(5).fill(null).map(() => ({ filled: false, hover: false }));
  onStarHover(star: any) {
    star.hover = true;
  }

  onStarLeave(star: any) {
    star.hover = false;
  }

  onStarClick(star: any,bookId:string,bookShelf:String) {
    const rating=this.stars.indexOf(star) + 1
    this.updateShelf(rating,bookId,bookShelf)
  }
  Change(target:any,bookId:string,rating:number){
    this.updateShelf(rating,bookId,target.value)
  }


  updateShelf(rating: number,bookId:string,bookShelf:String){
    const obj:object={
      "shelf": bookShelf,
      "rating": rating
    }
    this._CBAService.patchCBA('user/book',bookId,obj).subscribe((res) => {
      if(res.status==200){
        this.getBooks()
      }
    })
  }


}