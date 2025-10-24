import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { LoginComponent } from '../auth/login/login.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    LoginComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private auth: AuthService) {}

  user$ = this.auth.currentUser
}
