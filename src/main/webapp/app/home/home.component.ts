import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { LoginComponent } from '../auth/login/login.component';
import { MediaTypeListComponent } from '../media-type/media-type-list.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    LoginComponent,
    MediaTypeListComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(private auth: AuthService) {}

  user$ = this.auth.currentUser
}
