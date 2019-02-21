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
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  private url = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  public getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&currentpage=${currentPage}`;

    this.http
      .get<{ message: string; posts: Post[]; maxPosts: number }>(
        this.url + queryParams
      )
      .pipe(
        map((postData: any) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  public getPostsObservable(): Observable<{
    posts: Post[];
    postCount: number;
  }> {
    return this.postsUpdated.asObservable();
  }

  public getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>(this.url + '/' + id);
  }

  public addPost(post: Post, image: File): void {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);

    this.http
      .post<{ message: string; post: Post }>(this.url, postData)
      .subscribe(responseData => {
        post.id = responseData.post.id;
        post.imagePath = responseData.post.imagePath;
        this.posts.push(post);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.posts.length
        });
      });
  }

  public updatePost(
    id: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: Post | FormData;

    if (typeof (image === 'object')) {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else if (typeof image === 'string') {
      postData = {
        id,
        title,
        content,
        imagePath: image
      };
    }

    this.http
      .put(this.url + '/' + id, postData)
      .subscribe((response: { message: string; post: any }) => {
        const post: Post = {
          id: response.post._id,
          title: response.post.title,
          content: response.post.content,
          imagePath: response.post.imagePath
        };
        const updatedPosts = [...this.posts];
        const index = updatedPosts.findIndex(o => o.id === id);

        updatedPosts[index] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: updatedPosts.length
        });
      });
  }

  public deletePost(postId: string) {
    return this.http.delete(this.url + '/' + postId);
  }
}
