import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../../../shared/models/post';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  @Output() postCreated = new EventEmitter<Post>();

  constructor() {}

  ngOnInit() {}

  public onAddPost(form: NgForm): void {
    const post: Post = {
      title: form.value.title,
      content: form.value.content
    };

    this.postCreated.emit(post);
  }
}
