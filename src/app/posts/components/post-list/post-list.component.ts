import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Post } from '../../models/post.interface';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 5;
  pageSizeOpts = [1, 2, 5, 10];
  currentPage = 1;
  private subs: { [key:string]: Subscription } = {}

  constructor(private readonly postsService: PostsService, private readonly authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.userIsAuthenticated = this.authService.getIsAuthorized();
    this.userId = this.authService.getUserId();
    this.subs.authChangeSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
      });

    this.posts = this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.subs.postSub = this.postsService.getPostsUpdatedListener()
      .subscribe((data: {posts: Post[], totalPosts: number}) => {
          this.posts = data.posts;
          this.totalPosts = data.totalPosts;
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
    this.isLoading = true;
    this.postsService.deletePost(id)
      .subscribe( // TODO - fix deprecated usage style
        () => {
          // FIXME / TODO - when deleting last post on last page
          this.postsService.getPosts(this.postsPerPage, this.currentPage)
        },
        err => this.isLoading = false
      );
  }


}
