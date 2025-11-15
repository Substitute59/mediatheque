import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { UserEditComponent } from './user/user-edit.component';
import { MediaListComponent } from './media/media-list.component';
import { MediaDetailsComponent } from './media/media-details.component';
import { MediaAddComponent } from './media/media-add.component';
import { ErrorComponent } from './error/error.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: $localize`:@@home.index.headline:Bienvenue sur Stackr`
  },
  {
    path: 'users/edit/:id',
    component: UserEditComponent,
    canActivate: [authGuard],
    title: $localize`:@@user.edit.headline:Edit User`
  },
  {
    path: 'medias',
    component: MediaListComponent,
    canActivate: [authGuard],
    title: $localize`:@@media.list.headline:Medias`
  },
  {
    path: 'media/:id',
    component: MediaDetailsComponent,
    canActivate: [authGuard],
    title: $localize`:@@media.list.headline:Media Details`
  },
  {
    path: 'medias/add',
    component: MediaAddComponent,
    canActivate: [authGuard],
    title: $localize`:@@media.add.headline:Add Media`
  },
  {
    path: 'medias/edit/:id',
    component: MediaAddComponent,
    canActivate: [authGuard],
    title: $localize`:@@media.edit.headline:Edit Media`
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: $localize`:@@error.page.headline:Error`
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: $localize`:@@register.headline:Création de compte`
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: $localize`:@@forgotPassword.headline:Mot de passe oublié`
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: $localize`:@@resetPassword.headline:Mot de passe oublié`
  },
  {
    path: '**',
    component: ErrorComponent,
    title: $localize`:@@notFound.headline:Page not found`
  }
];
