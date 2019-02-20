import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatPaginatorModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './features/posts/post-create/post-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './shared/header/header.component';
import { PostListComponent } from './features/posts/post-list/post-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ErrorService } from './core/services/error.service';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
