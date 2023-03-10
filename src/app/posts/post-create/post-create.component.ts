import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  title=''
  content = '';
  @Output() postCreated = new EventEmitter()

  onAddPost() {
    const post = {title: this.title, content: this.content}
    this.postCreated.emit(post);
    console.log(post);
    
  }

}
