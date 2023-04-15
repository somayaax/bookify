import { Component } from '@angular/core';
import { CBAService } from '../../services/cba.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BooksResponse } from '../../Interfaces/booksresponse';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent {

  trendingBooks: any[] = [];
  trendingCategories: any[] = [];
  trendingAuthors: any[] = [];

  allCategories: any[];
  allAuthors: any[];

  showAddButton: boolean = true;
  showUpdatePopUp: boolean = false;

  updateMessageS: string = '';
  updateMessageF: string = '';
  addMessageS: string = '';
  addMessageF: string = '';
  currentBookId: string = '';

  currentPage: number = 1;
  limit: number = 5;
  bookResponse: any = {};
  categoryResponse:any ={};

  // selectedFile!:File;
  photo: any;


  constructor(private _CBAService: CBAService, public fb: FormBuilder) {
    //get
    this._CBAService.getCBA('book', this.currentPage, this.limit).subscribe((res) => {
      if (res.body.message == 'success') {
        this.trendingBooks = res.body.books.docs;
        ({ totalDocs: this.bookResponse.totalDocs, limit: this.bookResponse.limit, totalPages: this.bookResponse.totalPages, page: this.bookResponse.page, hasPrevPage: this.bookResponse.hasPrevPage, hasNextPage: this.bookResponse.hasNextPage } = res.body.books);
      }
    });

    this._CBAService.getCBA('categories', this.currentPage, this.limit).subscribe((res) => {
      if (res.body.message == 'success') {
        this.trendingCategories = res.body.category.docs;
        this.allCategories = res.body.category.docs;
        ({ totalDocs: this.categoryResponse.totalDocs, limit: this.categoryResponse.limit, totalPages: this.categoryResponse.totalPages, page: this.categoryResponse.page, hasPrevPage: this.categoryResponse.hasPrevPage, hasNextPage: this.categoryResponse.hasNextPage } = res.body.category);
      }
    });

    this._CBAService.getCBA('author', this.currentPage, this.limit).subscribe((res) => {
      if (res.body.message == 'success') {
        this.trendingAuthors = res.body.authors.docs;
        this.allAuthors = res.body.authors.docs;
      }
    })

  }

  bookForm: any = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    category: new FormControl(null, [Validators.required]),
    author: new FormControl(null, [Validators.required]),
    photo: new FormControl(null, [Validators.required]),
  });

  updateBookForm: any = new FormGroup({
    name: new FormControl(null),
    category: new FormControl(null),
    author: new FormControl(null),
    photo: new FormControl(null)
  });

  uploadImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.photo = file
    }
  }

  //Post
  submitAddBookForm(bookForm: FormGroup) {
    let category = this.trendingCategories.find((u) => u.Name === this.bookForm.get('category').value);
    let author = this.trendingAuthors.find((item) => {
      let authorFormValue = this.bookForm.get('author').value;
      for (let prop in authorFormValue) {
        if (authorFormValue.hasOwnProperty(prop) && item[prop] !== authorFormValue[prop]) {
          return false;
        }
      }
      return true;
    });
    // Return the found object or undefined if not found
    if (author) {

      const formData: FormData = new FormData();
      formData.append('name', this.bookForm.get('name').value);
      formData.append('categoryId', category._id);
      formData.append('authorId', author._id);
      formData.append('photo', this.photo);

      this._CBAService.postCBA('book', formData).subscribe((res) => {
        if (res.body.message == 'success') {
          this.addMessageS = 'Book is added successfully ';
          this._CBAService.getCBA('book', this.currentPage, this.limit).subscribe((res) => {
            this.trendingBooks = res.body.books.docs;
          })
          alert('Book is added successfully')
        }
        else {
          this.addMessageF = 'Failed';
          alert('Failed to add book')
      
          // complete: () => this.updateMessageS = 'Updated Successfully'
       
        }
      });
      return author;
    } else {
      console.log('Author not found');
      return undefined;
    }
    

  }


  nextPage() {
    if (this.bookResponse.hasNextPage && this.currentPage < this.bookResponse.totalPages) {
      this.currentPage++;
      this._CBAService.getCBA('book', this.currentPage, this.limit).subscribe((res) => {
        if (res.body.message == 'success') {
          this.trendingBooks = res.body.books.docs;
          ({ totalDocs: this.bookResponse.totalDocs, limit: this.bookResponse.limit, totalPages: this.bookResponse.totalPages, page: this.bookResponse.page, hasPrevPage: this.bookResponse.hasPrevPage, hasNextPage: this.bookResponse.hasNextPage } = res.body.books);
        }
      });
    }

  }

  prevPage() {
    if (this.bookResponse.hasPrevPage && this.currentPage > 1) {
      this.currentPage--;
      this._CBAService.getCBA('book', this.currentPage, this.limit).subscribe((res) => {
        if (res.body.message == 'success') {
          this.trendingBooks = res.body.books.docs;
          ({ totalDocs: this.bookResponse.totalDocs, limit: this.bookResponse.limit, totalPages: this.bookResponse.totalPages, page: this.bookResponse.page, hasPrevPage: this.bookResponse.hasPrevPage, hasNextPage: this.bookResponse.hasNextPage } = res.body.books);
        }
      });
    }

  }

  //delete
  deleteBook(id: string) {
    this._CBAService.deleteCBA('book', id).subscribe({
      next: (res) => {
        this._CBAService.getCBA('book', this.currentPage, this.limit).subscribe({
          next: (res) => { this.trendingBooks = res.body.books.docs },
          error: (err) => { "err fe el get eli fe el delete" },
        });
      },
      error: (err) => { console.error("err fe el delete") },
      // alert(res.body.message);
    });
  }


  showAddPopUpFunction() {
    this.showAddButton = false;
    console.log(this.trendingCategories);
  };

  closeAddPopUpFunction() {
    this.showAddButton = true;
    this.bookForm.reset();
    this.addMessageS = '';
    this.addMessageF = '';
  };

  // myUpdateInputControl = new FormControl();
  showUpdatePopUpFunction(bookId: string, tableId: number) {
    this.showUpdatePopUp = true;
    this.currentBookId = bookId;
  };

  closeUpdatePopUpFunction() {
    this.showUpdatePopUp = false;
    this.updateBookForm.get('name').value = null;
    this.updateBookForm.get('category').value = null;
    this.updateBookForm.get('author').value = null;
    // this.updateBookForm.get('photo').value = null;
    this.updateMessageS = '';
    this.updateMessageF = '';
  };



  // //Update
  submitUpdateBookForm(updateBookForm: FormGroup) {
    let category = this.trendingCategories.find((u) => u.Name === this.updateBookForm.get('category').value);
    let author = this.trendingAuthors.find((item) => {
      let authorFormValue = this.updateBookForm.get('author').value;
      for (let prop in authorFormValue) {
        if (authorFormValue.hasOwnProperty(prop) && item[prop] !== authorFormValue[prop]) {
          return false;
        }
      }
      return true;
    });
    // Return the found object or undefined if not found
    const formData: FormData = new FormData();
    if (this.updateBookForm.get('name').value) {
      formData.append('name', this.updateBookForm.get('name').value);
    };

    if (this.updateBookForm.get('category').value) {
      formData.append('categoryId', category._id);
    };

    if (this.updateBookForm.get('author').value) {
      formData.append('authorId', author._id);
    };
    
    if (this.updateBookForm.get('photo').value) {
      formData.append('photo', this.photo);
    };

    this._CBAService.patchCBA('book', this.currentBookId, formData).subscribe({
      next: (res) => {
        this._CBAService.getCBA('book', this.currentPage, this.limit).subscribe({
          next: (res) => this.trendingBooks = res.body.books.docs,
          error: (err) => alert('error fe el getauthor eli feh update')
        })
      },
      // error: (err) => this.updateMessageF = 'Failed',
      // complete: () => this.updateMessageS = 'Updated Successfully'
         
      error: (err) => alert('Failed to update'),
      complete: () =>alert('Updated Successfully')

    })

  }


  onLightBoxContainerClick(event: MouseEvent) {
    const form = document.querySelector('#addCatogryPopUp ');
    const formElements = form.querySelectorAll('input, button');
    if (!form.contains(event.target as Element) && !Array.from(formElements).includes(event.target as Element)) {
      this.closeAddPopUpFunction();
    }
  }
  onLightBoxContainerClickUpdate(event: MouseEvent) {
    const form = document.querySelector('#updateCatogryPopUp');
    const formElements = form.querySelectorAll('input, button');
    if (!form.contains(event.target as Element) && !Array.from(formElements).includes(event.target as Element)) {
      this.closeUpdatePopUpFunction();
    }
  }

  selectedCategory:any;
  onSelectCategory(event: MouseEvent){
    event.preventDefault();
    // event.stopPropagation();
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (value === "see-more") {
      
      console.log("ay7aga");
      console.log(this.categoryResponse);
      console.log(this.allCategories);
      if (this.categoryResponse.hasNextPage && this.currentPage < this.categoryResponse.totalPages) {
        this.currentPage++;
        this._CBAService.getCBA('categories', this.currentPage, this.limit).subscribe((res) => {
          if (res.body.message == 'success') {
            this.allCategories.push(...res.body.category.docs);
            console.log(this.allCategories);
            ({ totalDocs: this.categoryResponse.totalDocs, limit: this.categoryResponse.limit, totalPages: this.categoryResponse.totalPages, page: this.categoryResponse.page, hasPrevPage: this.categoryResponse.hasPrevPage, hasNextPage: this.categoryResponse.hasNextPage } = res.body.category);
          }
        });
      }
      this.updateBookForm.controls['category'].setValue(null);
      this.bookForm.controls['category'].setValue(null);
      // target.open = true;
      const dropdown = target.parentElement;
      dropdown.classList.add('keep-open');
      setTimeout(() => {
      dropdown.classList.remove('keep-open');
      }, 0);
    }

  }
}

