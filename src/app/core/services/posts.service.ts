import { Injectable } from '@angular/core';
import { Post } from '../../shared/models/post';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor() {}

  public getPosts(): Post[] {
    return [...this.posts];
  }

  public getPostsObservable(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  public addPost(post: Post): void {
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
