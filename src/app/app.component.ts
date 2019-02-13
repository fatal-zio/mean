import { Component } from '@angular/core';
import { Post } from './shared/models/post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public posts: Post[] = [];

  public onPostAdded(post: Post): void {
    this.posts.push(post);
  }
}
