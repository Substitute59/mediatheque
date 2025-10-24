import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../auth/auth.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    NgOptimizedImage,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RouterLink
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  environment = environment

  constructor(private auth: AuthService) {}

  user$ = this.auth.currentUser

  logout() {
    this.auth.logout();
  }
}
