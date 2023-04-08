import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, Subject } from 'rxjs';
import { Post } from '../posts/models/post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], totalPosts: number }>();
  
  get SERVER_BASE() {
    return `http://localhost:3000`
  } 

  constructor(private readonly http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number): Post[] {
    const params = {
      pageSize: postsPerPage,
      page: currentPage
    }
    
    this.http.get<{ message: string, posts: any[], totalPosts: number}>(`${this.SERVER_BASE}/api/posts`, { params } )
      .pipe(map(res => {
        return {
          posts: res.posts.map(post => this.convertFetchedPost(post)),
          totalPosts: res.totalPosts
        }
      }))
      .subscribe(data => {
        this.posts = data.posts; 
        this.postsUpdated.next({
          posts: [...this.posts],
          totalPosts: data.totalPosts
        })
      })
    return [...this.posts];
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<{message: string, post?: Post}>(`${this.SERVER_BASE}/api/posts/${id}`)
      .pipe(
        map(res => (res.post) ? this.convertFetchedPost(res.post) : undefined)
      )
  }

  getPostsUpdatedListener(): Observable<{posts: Post[], totalPosts: number}> {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const post = this.postAsFormData(title, content, image);

    this.http.post<{message: string, post: Post}>(`${this.SERVER_BASE}/api/posts`, post)
      .subscribe(res => this.router.navigate(['/']));
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    const postData: FormData | Post = (typeof(image) == 'object')
      ? this.postAsFormData(title, content, image, id) 
      : { id, title, content, imagePath: image as string, creator: null }

    this.http.put<{message: string, post: Post}>(`${this.SERVER_BASE}/api/posts/${id}`, postData)
      .subscribe(res => this.router.navigate(['/']))
  }

  deletePost(id: string) {
    return this.http.delete(`${this.SERVER_BASE}/api/posts/${id}`);
  }

  /** Converts a post retrieved from the backend to the appropriate form */
  private convertFetchedPost(post: any): Post {
    return {
      id: post._id,
      title: post.title,
      content: post.content,
      imagePath: post.imagePath,
      creator: post.creator
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
