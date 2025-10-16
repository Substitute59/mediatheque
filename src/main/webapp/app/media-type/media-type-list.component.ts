import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MediaTypeService } from 'app/media-type/media-type.service';
import { MediaTypeDTO } from 'app/media-type/media-type.model';


@Component({
  selector: 'app-media-type-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './media-type-list.component.html'})
export class MediaTypeListComponent implements OnInit, OnDestroy {

  mediaTypeService = inject(MediaTypeService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  mediaTypes?: MediaTypeDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@mediaType.delete.success:Media Type was removed successfully.`,
      'mediaType.genre.mediaType.referenced': $localize`:@@mediaType.genre.mediaType.referenced:This entity is still referenced by Genre ${details?.id} via field Media Type.`,
      'mediaType.media.mediaType.referenced': $localize`:@@mediaType.media.mediaType.referenced:This entity is still referenced by Media ${details?.id} via field Media Type.`
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
    this.mediaTypeService.getAllMediaTypes()
        .subscribe({
          next: (data) => this.mediaTypes = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.mediaTypeService.deleteMediaType(id)
        .subscribe({
          next: () => this.router.navigate(['/mediaTypes'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/mediaTypes'], {
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
