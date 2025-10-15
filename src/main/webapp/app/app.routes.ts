import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MediaListComponent } from './media/media-list.component';
import { MediaAddComponent } from './media/media-add.component';
import { MediaEditComponent } from './media/media-edit.component';
import { ErrorComponent } from './error/error.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: $localize`:@@home.index.headline:Welcome to your new app!`
  },
  {
    path: 'medias',
    component: MediaListComponent,
    title: $localize`:@@media.list.headline:Medias`
  },
  {
    path: 'medias/add',
    component: MediaAddComponent,
    title: $localize`:@@media.add.headline:Add Media`
  },
  {
    path: 'medias/edit/:id',
    component: MediaEditComponent,
    title: $localize`:@@media.edit.headline:Edit Media`
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: $localize`:@@error.page.headline:Error`
  },
  {
    path: '**',
    component: ErrorComponent,
    title: $localize`:@@notFound.headline:Page not found`
  }
];
