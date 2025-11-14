import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
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
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  environment = environment
  items: MenuItem[] | undefined;

  constructor(private auth: AuthService) {
    this.items = [
      {
        label: $localize`:@@header.menu.mediatheque:Ma médiathèque`,
        routerLink: '/medias',
        routerLinkActiveOptions: { 
          exact: true,
          queryParams: 'exact'
        }
      },
      {
        label: $localize`:@@header.menu.wishlist:Ma wishlist`,
        routerLink: ['/medias'],
        queryParams: { flagId: 2 },
        routerLinkActiveOptions: { 
          exact: true,
          queryParams: 'exact'
        }
      }
    ]
  }

  user$ = this.auth.currentUser

  logout() {
    this.auth.logout();
  }
}
