import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostCreateComponent } from './posts/components/post-create/post-create.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { AuthGuard } from './guards/auth.guard';
import { PostListComponent } from './posts/components/post-list/post-list.component';

const routes: Routes = [
  { path:  '', component: PostListComponent },
  { path:  'create', component: PostCreateComponent, canActivate: [ AuthGuard ] },
  { path:  'edit/:id', component: PostCreateComponent, canActivate: [ AuthGuard ] },
  { path:  'login', component: LoginComponent, },
  { path:  'signup', component: SignUpComponent, },
]

@NgModule({
  declarations: [],
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [ AuthGuard ]
})
export class AppRoutingModule { }
