import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CBAService } from 'src/app/services/cba.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent {
  id: string = this._ActivatedRoute.snapshot.params['id'];
  book: any;
  shelf: any = {};
  category: any;
  author: any;
  userReview: string;
  userReviewed: boolean = false;
  userLoggedIn: boolean = false;
  update: boolean = false;

  constructor(private _CBAService: CBAService, private _ActivatedRoute: ActivatedRoute, private _router: Router, private _auth: AuthService) {
    this.getBook()
  }

  getBook() {
    this._CBAService.getByID('book', this.id).subscribe((res) => {
      if (res.status === 200) {
        this.book = res.body.book.book;
        this.category = res.body.book.book.categoryId;
        this.author = res.body.book.book.authorId;
        if (res.body.book.shelf) {
          this.shelf = res.body.book.shelf[0];
        }
      }
      this.getLoggedInUser()
    });
  }

  getLoggedInUser() {
    if (this._auth.currentUser.getValue() && this._auth.currentUser.getValue().role === 'user') {
      const userId = this._auth.currentUser.getValue().id;
      this.userLoggedIn = true;
      for (let review of this.book.reviews) {
        if (review.userId._id == userId) {

          this.userReviewed = true;
          this.userReview = review.comment;
          return;
        }
      }
    }
    this.userLoggedIn = false;
    return;
  }
  addReview(form: NgForm) {
    if (!this.userLoggedIn) {
      this._router.navigate(['/user/login']);
      return;
    }
    const formData: FormData = new FormData();
    formData.append('comment', this.userReview);
    this._CBAService.addReview(this.book._id, formData).subscribe((res) => {
      this.getBook();
    })
  }
  updateReview(form: NgForm) {
    const formData: FormData = new FormData();
    formData.append('comment', this.userReview);

    this._CBAService.updateReview(this.book._id, formData).subscribe((res) => {
      this.update = false
      this.getBook();
    }, (err) => {
      console.log(err);

    })

  }

  wantToUpdate() {
    this.update = true;
  }

  stars: { filled: boolean, hover: boolean }[] = Array(5).fill(null).map(() => ({ filled: false, hover: false }));
  onStarHover(star: any) {
    star.hover = true;
  }

  onStarLeave(star: any) {
    star.hover = false;
  }

  onStarClick(star: any, bookId: string, bookShelf: String) {
    const rating = this.stars.indexOf(star) + 1
    this.updateShelf(rating, bookId, bookShelf)
  }

  Change(target: any, bookId: string, rating: number) {
    this.updateShelf(rating, bookId, target.value)
  }

  updateShelf(rating: number, bookId: string, bookShelf: String) {
    const obj: object = {
      "shelf": bookShelf,
      "rating": rating
    }
    this._CBAService.patchCBA('user/book', bookId, obj).subscribe({
      next: (res) => {
        if (res.status == 200)
          this.getBook()
      },
      error: (err) => this._router.navigate(['/user/login'])

    })
  }


}