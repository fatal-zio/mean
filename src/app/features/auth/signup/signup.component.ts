import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/core/services/error.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private errorService: ErrorService
  ) {}

  ngOnInit() {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService
      .createUser(form.value.email, form.value.password)
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        error => {
          this.isLoading = false;
          this.errorService.handleError(error);
        }
      );
  }
}
