import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/models/post.interface';
import { PostsService } from 'src/app/services/posts.service';
import { mimeType } from 'src/app/validators/mime-type.validator';

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
  isLoading = false;
  form: FormGroup
  post: Post;
  imagePreview: string;
  private mode: EditMode = EditMode.CREATE;
  private editingId: string;

  constructor(private readonly postsService: PostsService, private readonly route: ActivatedRoute) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = EditMode.EDIT;
        this.editingId = paramMap.get('id');
        this.isLoading = true;
        this.postsService.getPost(this.editingId)
          .subscribe(post => {
            this.post = post;
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
            this.isLoading = false;
          })
      } else {
        this.mode = EditMode.CREATE
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // TODO - indicate if theres a bad file present or dont patch
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    // NOTE: setting this back to false is not currently necessary (navigating back to home)
    // if this logic changes this needs to be addressed
    this.isLoading = true; 
    this.mode === EditMode.CREATE
      ? this.postsService.addPost(
          this.form.value.title, 
          this.form.value.content,
          this.form.value.image
        )
      : this.postsService.updatePost(
          this.editingId, 
          this.form.value.title, 
          this.form.value.content,
          this.form.value.image
        )
    
    this.form.reset();
  }

}
