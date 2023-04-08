import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { PostListComponent } from './components/post-list/post-list.component';
import { PostCreateComponent } from './components/post-create/post-create.component';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    PostListComponent,
    PostCreateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule
  ]
})
export class PostsModule { }
