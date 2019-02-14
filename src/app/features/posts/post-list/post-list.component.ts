import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { PostsService } from '../../../core/services/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];
  private postsSub: Subscription;

  constructor(private postService: PostsService) {}

  ngOnInit() {
    this.postsSub = this.postService
      .getPosts()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
