import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { CollectionService } from 'app/collection/collection.service';
import { CollectionDTO } from 'app/collection/collection.model';


@Component({
  selector: 'app-collection-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './collection-list.component.html'})
export class CollectionListComponent implements OnInit, OnDestroy {

  collectionService = inject(CollectionService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  collections?: CollectionDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@collection.delete.success:Collection was removed successfully.`,
      'collection.mediaCollection.collection.referenced': $localize`:@@collection.mediaCollection.collection.referenced:This entity is still referenced by Media Collection ${details?.id} via field Collection.`
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
    this.collectionService.getAllCollections()
        .subscribe({
          next: (data) => this.collections = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.collectionService.deleteCollection(id)
        .subscribe({
          next: () => this.router.navigate(['/collections'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/collections'], {
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
