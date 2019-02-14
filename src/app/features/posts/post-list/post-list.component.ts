import { Component, OnInit, OnDestroy } from '@angular/core';
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
    this.postService.getPosts();
    this.postsSub = this.postService
      .getPostsObservable()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  onDelete(postId: string): void {
    this.postService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
