import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CBAService } from 'src/app/services/cba.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {

  photo: any;
  errors: string = '';
  constructor(private _CBAService: CBAService, private _router: Router) {

  }

  registerForm = new FormGroup({
    firstName: new FormControl(null, [Validators.minLength(3), Validators.maxLength(20), Validators.required, Validators.pattern('[A-Za-z0-9]{3,20}$')]),
    lastName: new FormControl(null, [Validators.minLength(3), Validators.maxLength(20), Validators.required, Validators.pattern('[A-Za-z0-9]{3,20}$')]),
    photo: new FormControl(null, [Validators.required]),
    DOB: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^[A-Z][a-z0-9]{5,15}$')]),
    cPassword: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^[A-Z][a-z0-9]{5,15}$')]),
  })

  uploadImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.photo = file
    }
  }

  submitRegisterForm(registerForm: FormGroup) {
    const formData: FormData = new FormData();
    formData.append('firstName', this.registerForm.get('firstName').value);
    formData.append('lastName', this.registerForm.get('lastName').value);
    formData.append('DOB', this.registerForm.get('DOB').value);
    formData.append('email', this.registerForm.get('email').value);
    formData.append('password', this.registerForm.get('password').value);
    formData.append('cPassword', this.registerForm.get('cPassword').value);
    formData.append('photo', this.photo);

    this._CBAService.postUser('user/signUp', formData).subscribe({
      next: (res) => {
        if (res.status == 201) {
          this._router.navigate(['user/login']);
        }
      },
      error: (err) => {
        if (err.error.error.includes('E11000 duplicate key error')) {

          this.errors = "Email already exists!";
        }
      }


    })
  }

}
