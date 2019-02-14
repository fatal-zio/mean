import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../../../core/services/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/shared/models/post';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode: string;
  private postId: string;
  public post: Post;

  constructor(
    private postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
        });
      } else {
        this.mode = 'create';
        this.postId = undefined;
      }
    });
  }

  public onSavePost(form: NgForm): void {
    if (this.mode === 'create') {
      this.postsService.addPost({
        id: undefined,
        title: form.value.title,
        content: form.value.content
      });
    } else {
      this.postsService.updatePost({
        id: this.postId,
        title: form.value.title,
        content: form.value.content
      });
    }

    form.resetForm();
  }
}
