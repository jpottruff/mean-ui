import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from 'src/app/models/post.interface';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  title=''
  content = '';
  @Output() postCreated = new EventEmitter<Post>()

  onAddPost() {
    const post: Post = {title: this.title, content: this.content}
    this.postCreated.emit(post);
  }

}
