import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    NgOptimizedImage,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  items: MenuItem[] | undefined;
  q: string = '';

  constructor(private auth: AuthService, private router: Router) {
    this.items = [
      {
        label: $localize`:@@header.menu.mediatheque:Ma médiathèque`,
        routerLink: '/collection',
        routerLinkActiveOptions: { 
          exact: true,
          queryParams: 'exact'
        }
      },
      {
        label: $localize`:@@header.menu.wishlist:Ma wishlist`,
        routerLink: ['/collection'],
        queryParams: { flagId: 2 },
        routerLinkActiveOptions: { 
          exact: true,
          queryParams: 'exact'
        }
      },
      {
        label: $localize`:@@header.menu.wishlist:Tous les médias`,
        routerLink: ['/search'],
        routerLinkActiveOptions: { 
          exact: true,
          queryParams: 'exact'
        }
      }
    ]
  }

  user$ = this.auth.currentUser

  search() {
    this.router.navigate(['/search/' + this.q]);
  }

  logout() {
    this.auth.logout();
  }
}
