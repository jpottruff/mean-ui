import { Component } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  // posts = [
  //   {title: 'Firstpost', content: 'This is the content of a post'},
  //   {title: 'Second post', content: 'This is the content of a post'},
  //   {title: 'Third post', content: 'This is the content of a post'}
  // ]
  posts = [];
}
