import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostCreateComponent } from './posts/components/post-create/post-create.component';
import { AuthGuard } from './guards/auth.guard';
import { PostListComponent } from './posts/components/post-list/post-list.component';

const routes: Routes = [
  { path:  '', component: PostListComponent },
  { path:  'create', component: PostCreateComponent, canActivate: [ AuthGuard ] },
  { path:  'edit/:id', component: PostCreateComponent, canActivate: [ AuthGuard ] },
  { path:  'auth', loadChildren: () => import('./auth/auth.module').then(x => x.AuthModule) },
]

@NgModule({
  declarations: [],
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  // providers: [ ]
})
export class AppRoutingModule { }