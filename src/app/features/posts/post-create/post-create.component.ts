import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../../../shared/models/post';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  public enteredTitle = '';
  public enteredContent = '';
  @Output() postCreated = new EventEmitter<Post>();

  constructor() {}

  ngOnInit() {}

  public onAddPost(): void {
    const post = {
      title: this.enteredTitle,
      content: this.enteredContent
    };

    this.postCreated.emit(post);
  }
}
