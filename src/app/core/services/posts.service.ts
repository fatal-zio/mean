import { Injectable } from '@angular/core';
import { Post } from '../../shared/models/post';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private url = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {
    this.http
      .get<{ message: string; posts: any }>(this.url)
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  public getPosts(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  public addPost(post: Post): void {
    this.http
      .post<{ message: string }>(this.url, post)
      .subscribe(responseData => {
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
