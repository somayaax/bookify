import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { CategoriesComponent } from './components/admin-categories/categories.component';
import { BooksComponent } from './components/admin-books/books.component';
import { AuthorsComponent } from './components/admin-authors/authors.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { HomeheaderComponent } from './components/homeheader/homeheader.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { UserbooksComponent } from './components/userbooks/userbooks.component';
import { CommonModule } from '@angular/common';
import { AllbooksComponent } from './components/allbooks/allbooks.component';
import { AuthorDetailsComponent } from './components/author-details/author-details.component';
import { CategoryComponent } from './components/category/category.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { AllAuthorsComponent } from './components/all-authors/all-authors.component';
import { AllCategoriesComponent } from './components/all-categories/all-categories.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    CategoriesComponent,
    BooksComponent,
    AuthorsComponent,
    NotfoundComponent,
    RegisterComponent,
    HomeComponent,
    HomeheaderComponent,
    UserbooksComponent,
    AllbooksComponent,
    AuthorDetailsComponent,
    CategoryComponent,
    BookDetailComponent,
    AllAuthorsComponent,
    AllCategoriesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CarouselModule,
    CommonModule,
    MatTabsModule,
    FormsModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
