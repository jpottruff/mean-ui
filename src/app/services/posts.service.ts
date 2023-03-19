import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private readonly http: HttpClient, private router: Router) { }

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

  addPost(title: string, content: string, image: File) {
    const post = new FormData();
    post.append('title', title);
    post.append('content', content);
    // make sure 'image' lines up with the property being accessed by multer on the backend 
    post.append('image', image, title);

    this.http.post<{message: string, post: Post}>(`${this.SERVER_BASE}/api/posts`, post)
      .subscribe(res => {
        const savedPost: Post = {
          id: res.post.id,
          title,
          content,
          imagePath: res.post.imagePath,
        };
        this.posts.push(savedPost);
        this.postsUpdated.next([...this.posts]);

        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    // TODO handle images on update
    const post: Post = { id, title, content, imagePath: null };
    this.http.put<{message: string}>(`${this.SERVER_BASE}/api/posts/${id}`, post)
      .subscribe(res => {
        const updatedPosts = [...this.posts];
        const stalePostIndex = updatedPosts.findIndex(post => post.id === id);
        updatedPosts[stalePostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);

        this.router.navigate(['/'])
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
      content: post.content,
      imagePath: post.imagePath
    }
  }
}
