import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MediaService } from 'app/media/media.service';
import { MediaDTO } from 'app/media/media.model';


@Component({
  selector: 'app-media-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './media-list.component.html'})
export class MediaListComponent implements OnInit, OnDestroy {

  mediaService = inject(MediaService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  medias?: MediaDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@media.delete.success:Media was removed successfully.`    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }
  
  loadData() {
    this.mediaService.getAllMedias()
        .subscribe({
          next: (data) => this.medias = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.mediaService.deleteMedia(id)
        .subscribe({
          next: () => this.router.navigate(['/medias'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
