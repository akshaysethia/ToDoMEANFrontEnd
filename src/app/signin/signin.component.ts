import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../shared/users';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  @ViewChild('suForm') signinDirective;
  signupForm: FormGroup;
  signup: User;
  errMsg: string;

  formErrors = {
    'name': '',
    'username': '',
    'email': '',
    'password': ''
  };

  validationMessages = {
    'name': {
      'required': 'name is Required !',
      'minlength': 'name should be atleast 5 chars',
      'maxlength': 'name was asked, not an essay !'
    },
    'username': {
      'required': 'username is required !',
      'minlength': 'username should be atleast 5 chars',
      'maxlength': 'username was asked, not an essay !'
    },
    'email': {
      'required': 'email is required !',
      'email': 'email not in valid format.'
    },
    'password': {
      'required': 'password is required !',
      'minlength': 'password should be atleast 6 chars',
      'maxlength': 'password was asked, not an essay !'
    }
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]]
    });

    this.signupForm.valueChanges
      .subscribe(data => this.onValueChange(data));

    this.onValueChange();
  }

  onValueChange(data?: any) {
    if (!this.signupForm) { return; }
    const form = this.signupForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + '\n';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.signup = this.signupForm.value;
    this.authService.signup(this.signup)
      .subscribe(data => {
        if (data.success) {
          this.errMsg = <string>data.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.errMsg = <string>data.message;
        }
      }, err => console.log('An Error Occured !', err));

    this.signupForm.reset();
    this.signinDirective.resetForm();
  }

  reset() {
    this.signupForm.reset();
  }

}
