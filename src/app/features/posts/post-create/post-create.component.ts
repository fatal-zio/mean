import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../../../core/services/posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from 'src/app/shared/models/post';
import { mimeType } from '../../../shared/validators/mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode: string;
  private postId: string;
  public post: Post;
  public isLoading = false;
  public form: FormGroup;
  public imagePreview: string;

  constructor(
    private postsService: PostsService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { asyncValidators: [mimeType] })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.get('id');

        this.isLoading = true;

        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = undefined;
      }
    });
  }

  public onSavePost(): void {
    this.isLoading = true;

    if (this.mode === 'create') {
      this.postsService.addPost(
        {
          id: undefined,
          title: this.form.value.title,
          content: this.form.value.content,
          imagePath: null
        },
        this.form.value.image
      );
    } else {
      this.postsService.updatePost({
        id: this.postId,
        title: this.form.value.title,
        content: this.form.value.content,
        imagePath: null
      });
    }

    this.form.reset();
    this.router.navigate(['/']);
  }

  public onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };

    reader.readAsDataURL(file);
  }
}
