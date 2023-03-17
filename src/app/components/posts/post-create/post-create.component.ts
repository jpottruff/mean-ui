import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/models/post.interface';
import { PostsService } from 'src/app/services/posts.service';

export enum EditMode {
  CREATE = 'CREATE',
  EDIT = 'EDIT'
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post: Post;
  isLoading = false;
  private mode: EditMode = EditMode.CREATE;
  private editingId: string;

  constructor(private readonly postsService: PostsService, private readonly route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = EditMode.EDIT;
        this.editingId = paramMap.get('id');
        this.isLoading = true;
        this.postsService.getPost(this.editingId)
          .subscribe(post => {
            this.post = post
            this.isLoading = false;
          })
      } else {
        this.mode = EditMode.CREATE
      }
    });

  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // NOTE: setting this back to false is not currently necessary (navigating back to home)
    // if this logic changes this needs to be addressed
    this.isLoading = true; 
    this.mode === EditMode.CREATE
      ? this.postsService.addPost(form.value.title, form.value.content)
      : this.postsService.updatePost(this.editingId, form.value.title, form.value.content)
    
    form.resetForm();
  }

}
