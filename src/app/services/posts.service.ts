import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
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
    this.http.get<{ message: string, posts: any[]}>(`${this.SERVER_BASE}/api/posts`)
      .pipe(map(res => {
        return res.posts.map(post => this.convertFetchedPost(post))
      }))
      .subscribe(posts => {
        this.posts = posts; 
        this.postsUpdated.next([...this.posts])
      })
    return [...this.posts];
  }

  getPostsUpdatedListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.http.post<{message: string}>(`${this.SERVER_BASE}/api/posts`, post)
      .subscribe(res => {
        console.log(res.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  /** Converts a post retrieved from the backend to the appropriate form */
  private convertFetchedPost(post: any): Post {
    return {
      id: post._id,
      title: post.title,
      content: post.content
    }
  }
}
