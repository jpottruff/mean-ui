import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Post } from '../models/post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  
  get SERVER_BASE() {
    return `http://localhost:3000`
  } 

  constructor(private readonly http: HttpClient) { }

  getPosts(): Post[] {
    this.http.get<{ message: string, posts: Post[]}>(`${this.SERVER_BASE}/api/posts`)
      .subscribe(res => {
        this.posts = res.posts; 
        this.postsUpdated.next([...this.posts])
      })
    return [...this.posts];
  }

  getPostsUpdatedListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
