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
    return this.http.get<{message: string, post?: Post}>(`${this.SERVER_BASE}/api/posts/${id}`)
      .pipe(
        map(res => (res.post) ? this.convertFetchedPost(res.post) : undefined)
      )
  }

  getPostsUpdatedListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    // TODO - replace with function
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

  updatePost(id: string, title: string, content: string, image: File | string) {
    const postData: FormData | Post = (typeof(image) == 'object')
      ? this.postAsFormData(title, content, image, id)
      : {id, title, content, imagePath: image as string}

    this.http.put<{message: string, post: Post}>(`${this.SERVER_BASE}/api/posts/${id}`, postData)
      .subscribe(res => {
        const updatedPosts = [...this.posts];
        const stalePostIndex = updatedPosts.findIndex(p => p.id === id);
        const post = res.post;
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

  /** @returns a `Post` as a `FormData` object */
  private postAsFormData(title: string, content: string, image: File, id?: string): FormData {
    const postData = new FormData();
    if (id) {
      postData.append('id', id);
    }

    postData.append('title', title);
    postData.append('content', content);
    // make sure 'image' lines up with the property being accessed by multer on the backend 
    postData.append('image', image, title);

    return postData;
  }
}
