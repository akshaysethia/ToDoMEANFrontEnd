import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  name: string;
  username: string;
  email: string;
  errMsg: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getProfile()
      .subscribe(res => {
        console.log(res.name);
        this.name = res.name;
        this.username = res.username;
        this.email = res.email;
      }, err => this.errMsg = <any>err);
  }

}
