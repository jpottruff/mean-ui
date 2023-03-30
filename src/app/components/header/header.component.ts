import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private subs: { [key:string]: Subscription } = {}

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.subs.authSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    Object.values(this.subs).forEach(sub => sub.unsubscribe())
  }

  onLogout(): void {
    this.authService.logout();
  }
}
