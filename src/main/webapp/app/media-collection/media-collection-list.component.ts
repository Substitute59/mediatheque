import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MediaCollectionService } from 'app/media-collection/media-collection.service';
import { MediaCollectionDTO } from 'app/media-collection/media-collection.model';


@Component({
  selector: 'app-media-collection-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './media-collection-list.component.html'})
export class MediaCollectionListComponent implements OnInit, OnDestroy {

  mediaCollectionService = inject(MediaCollectionService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  mediaCollections?: MediaCollectionDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@mediaCollection.delete.success:Media Collection was removed successfully.`    };
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
    this.mediaCollectionService.getAllMediaCollections()
        .subscribe({
          next: (data) => this.mediaCollections = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.mediaCollectionService.deleteMediaCollection(id)
        .subscribe({
          next: () => this.router.navigate(['/mediaCollections'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
