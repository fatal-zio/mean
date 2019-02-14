import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../../../core/services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  constructor(private postsService: PostsService) {}

  ngOnInit() {}

  public onAddPost(form: NgForm): void {
    this.postsService.addPost({
      id: undefined,
      title: form.value.title,
      content: form.value.content
    });
    form.resetForm();
  }
}
