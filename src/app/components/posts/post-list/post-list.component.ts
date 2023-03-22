import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.interface';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 10; // TODO - dont hardcode
  postsPerPage = 5;
  pageSizeOpts = [1, 2, 5, 10];
  currentPage = 1;
  private subs: { [key:string]: Subscription } = {}

  constructor(private readonly postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.posts = this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.subs.postSub = this.postsService.getPostsUpdatedListener()
      .subscribe((posts: Post[]) => {
          this.posts = posts;
          this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    Object.values(this.subs).forEach(sub => sub.unsubscribe())
  }

  onChangedPage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.posts = this.postsService.getPosts(this.postsPerPage, this.currentPage);

  }

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }


}
