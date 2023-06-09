import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { AuthRoutingModule } from './auth-routing.module';

import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
