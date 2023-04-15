import { Component } from '@angular/core';
import { CBAService } from '../../services/cba.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  styleUrls: ['./author-details.component.scss']
})
export class AuthorDetailsComponent {

  id: string = this._ActivatedRoute.snapshot.params['id'];
  author: any;
  authorBooks: any;
  DOB: any;
  constructor(private _CBAService: CBAService, private _ActivatedRoute: ActivatedRoute, private _router: Router) {
    this.getAuthor()
  }

  getAuthor() {
    this._CBAService.getByID('author', this.id).subscribe((res) => {
      if (res.status === 200) {
        this.author = res.body.author.author;
        this.authorBooks = res.body.author.authorBooks;
        console.log(this.authorBooks);

        let authorDOB = new Date(res.body.author.author.DOB)
        this.DOB = `${authorDOB.getDate()}/${authorDOB.getMonth() + 1}/${authorDOB.getFullYear()}`

        console.log(this.authorBooks);

      }
    });
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
    console.log(rating, bookId, bookShelf);
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
          console.log('Shelf Updated');
        this.getAuthor()
      },
      error: (err) => this._router.navigate(['/user/login'])

    })
  }
}
