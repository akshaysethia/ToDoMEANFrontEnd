import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  errMsg: string;
  user = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.authService.loginUser(this.user)
      .subscribe(res => {
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errMsg = <string>res.message;
        }
      }, err => {
        this.errMsg = <any>err;
      });
  }

}
