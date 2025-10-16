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
      deleted: $localize`:@@media.delete.success:Media was removed successfully.`,
      'media.mediaArtist.media.referenced': $localize`:@@media.mediaArtist.media.referenced:This entity is still referenced by Media Artist ${details?.id} via field Media.`,
      'media.mediaCollection.media.referenced': $localize`:@@media.mediaCollection.media.referenced:This entity is still referenced by Media Collection ${details?.id} via field Media.`,
      'media.review.media.referenced': $localize`:@@media.review.media.referenced:This entity is still referenced by Review ${details?.id} via field Media.`,
      'media.userMedia.media.referenced': $localize`:@@media.userMedia.media.referenced:This entity is still referenced by User Media ${details?.id} via field Media.`
    };
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
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/medias'], {
                state: {
                  msgError: this.getMessage(messageParts[0], { id: messageParts[1] })
                }
              });
              return;
            }
            this.errorHandler.handleServerError(error.error)
          }
        });
  }

}
