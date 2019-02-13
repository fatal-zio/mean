import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../../shared/models/post';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  /* public posts = [
    { title: 'First Post', content: 'First post content here.' },
    { title: 'Second Post', content: 'Second post content here.' },
    { title: 'Third Post', content: 'Third post content here.' }
  ]; */

  @Input() posts: Post[] = [];

  constructor() {}

  ngOnInit() {}
}
