import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.interface';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private subs: { [key:string]: Subscription } = {}

  constructor(private readonly postsService: PostsService) {}

  ngOnInit() {
    this.posts = this.postsService.getPosts();
    this.subs.postSub = this.postsService.getPostsUpdatedListener()
      .subscribe((posts: Post[]) => {
          this.posts = posts;
      });
  }

  ngOnDestroy(): void {
    Object.values(this.subs).forEach(sub => sub.unsubscribe())
  }

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }
}
