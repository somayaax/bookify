import { Component } from '@angular/core';
import { CBAService } from '../../services/cba.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {

  trendingCategories:any[] = [];
  showAddButton:boolean = true;
  showUpdatePopUp:boolean = false;
  updateMessageS:string;
  updateMessageF:string;
  currentCategoryId:string = '';
  addMessageS:string;
  addMessageF:string;

  currentPage:number = 1;
  limit:number = 10;
  categoryResponse:any = {};
  
  error:string = '';
  constructor(private _CBAService:CBAService    ){
    //get
   this. _CBAService.getCBA('categories', this.currentPage, this.limit).subscribe({
      next: (res) => {this.trendingCategories = res.body.category.docs;
        ({totalDocs: this.categoryResponse.totalDocs,limit: this.categoryResponse.limit, totalPages: this.categoryResponse.totalPages, page: this.categoryResponse.page, hasPrevPage: this.categoryResponse.hasPrevPage, hasNextPage: this.categoryResponse.hasNextPage} = res.body.category);
      },
      error: (err) => console.error('error while getting categories'),
      complete: () => console.info('Complete')
    });
    
  }

  categoryForm:any = new FormGroup({
    Name: new FormControl(null, [Validators.required])
  });

  updateCategoryForm:any = new FormGroup({
    Name: new FormControl(null, [Validators.required])
  });
  
  //delete
  deleteCategory(id:string) {
    console.log(this.categoryResponse);
    console.log(id);
    this._CBAService.deleteCBA('categories', id).subscribe({
      next:(res) => this._CBAService.getCBA('categories', this.currentPage, this.limit).subscribe({
        next:(res) => this.trendingCategories = res.body.category.docs,
        error:(err) => console.error('error while getting categories in the delete methode'),
        complete:() => console.info('complete')
      }),
      error:(err) => {this.error = err.error.error},
      complete:() => console.info('Complete')
    })
  }


  showAddPopUpFunction() {
    this.showAddButton  = false;
  };
 

  closeAddPopUpFunction(){
    this.showAddButton  = true;
    this.categoryForm.reset();
    this.addMessageF = '';
    this.addMessageS = '';
  };
  // close

  // myUpdateInputControl = new FormControl();
  showUpdatePopUpFunction(categoryId:string, tableId:number) {
    this.showUpdatePopUp = true;
    this.currentCategoryId = categoryId;
    // this.myUpdateInputControl.setValue(this.trendingCategories[tableId].Name)
  };

  closeUpdatePopUpFunction(){
    this.showUpdatePopUp = false;
    // this.updateCategoryForm.reset();
    this.updateMessageS = '';
    this.updateMessageF = '';
  };


  //Update
  submitUpdateCategoryForm(updateCategoryForm:FormGroup){
    this._CBAService.patchCBA('categories', this.currentCategoryId, this.updateCategoryForm.value).subscribe((res)=>{
      if(res.body.message == 'success'){
        this._CBAService.getCBA('categories',this.currentPage,this.limit).subscribe((res) => {
          this.trendingCategories = res.body.category.docs;
        });
        this.updateMessageS = 'Updated successfully'
        alert('Category is updated successfully')
      }
      else {
        this.updateMessageF = 'Failed';
        alert('Failed to update Category')

      }
    });
  }


  
  //Add Category
  submitAddCategoryForm(categoryForm:FormGroup){
    this._CBAService.postCBA('categories',categoryForm.value).subscribe({
      next:(res) => this._CBAService.getCBA('categories',this.currentPage,this.limit).subscribe({
        next: (res) => this.trendingCategories = res.body.category.docs,
        error:(err) => console.error('error while getting categories in the add method'),
        complete: () => console.info('Complete')
        }),
        error:(err) => alert('Failed to add Category'),

        complete:() =>  alert('Category is added successfully')
      }) 
      
  }

  nextPage() {
    if(this.categoryResponse.hasNextPage && this.currentPage<this.categoryResponse.totalPages){
      console.log(this.currentPage);
      this._CBAService.getCBA('categories',this.currentPage, this.limit).subscribe((res) => {
        if(res.body.message == 'success'){
          this.trendingCategories = res.body.category.docs;
          console.log(this.trendingCategories);
          ({totalDocs: this.categoryResponse.totalDocs,limit: this.categoryResponse.limit, totalPages: this.categoryResponse.totalPages, page: this.categoryResponse.page, hasPrevPage: this.categoryResponse.hasPrevPage, hasNextPage: this.categoryResponse.hasNextPage} = res.body.category);
          console.log("this is category res", this.categoryResponse);
        }
      });
    }

  }

  prevPage() {
    if(this.categoryResponse.hasPrevPage && this.currentPage>1){
      this.currentPage--;
      console.log(this.currentPage);
      this._CBAService.getCBA('categories',this.currentPage, this.limit).subscribe((res) => {
        if(res.body.message == 'success'){
          this.trendingCategories = res.body.category.docs;
          ({totalDocs: this.categoryResponse.totalDocs,limit: this.categoryResponse.limit, totalPages: this.categoryResponse.totalPages, page: this.categoryResponse.page, hasPrevPage: this.categoryResponse.hasPrevPage, hasNextPage: this.categoryResponse.hasNextPage} = res.body.category);
          console.log("this is category res", this.categoryResponse);
        }
      });
    }

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
      this. closeUpdatePopUpFunction();
    }
  }
}
