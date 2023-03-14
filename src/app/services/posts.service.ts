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

  getPost(id: string): Observable<Post> {
    return this.http.get<{message: string, post?: any}>(`${this.SERVER_BASE}/api/posts/${id}`)
      .pipe(
        map(res => (res.post) ? this.convertFetchedPost(res.post) : undefined)
      )
  }

  getPostsUpdatedListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.http.post<{message: string, createdId: string}>(`${this.SERVER_BASE}/api/posts`, post)
      .subscribe(res => {
        const id = res.createdId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.http.put<{message: string}>(`${this.SERVER_BASE}/api/posts/${id}`, post)
      .subscribe(res => {
        // TODO / FIXME - brekaing changes introduced; currently not working as exptected
        const updatedPosts = [...this.posts];
        const stalePostIndex = updatedPosts.findIndex(post => post.id === id);
        updatedPosts[stalePostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }

  deletePost(id: string) {
    this.http.delete(`${this.SERVER_BASE}/api/posts/${id}`)
      .subscribe(res => {
        const updatedPosts = this.posts.filter(post => post.id !== id);
        this.posts = updatedPosts;
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
