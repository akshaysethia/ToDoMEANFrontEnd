import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username: string = undefined;
  subscription: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(name => { this.username = name; }, err => { console.log('An Error occured !', err); });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logOut(): void {
    this.username = undefined;
    this.authService.logOut();
    this.router.navigate(['/home']);
  }

}
