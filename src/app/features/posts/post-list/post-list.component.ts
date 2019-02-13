import { Component, OnInit } from '@angular/core';

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

  public posts = [];

  constructor() {}

  ngOnInit() {}
}
