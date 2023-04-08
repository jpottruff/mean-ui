import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  isLoading = false;
  private subs: { [key:string]: Subscription } = {}


  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.subs.authChangeSub = this.authService.getAuthStatusListener()
    .subscribe(_isAuthenticated => { 
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    Object.values(this.subs).forEach(sub => sub.unsubscribe());
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
