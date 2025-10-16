import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { UserMediaService } from 'app/user-media/user-media.service';
import { UserMediaDTO } from 'app/user-media/user-media.model';


@Component({
  selector: 'app-user-media-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-media-list.component.html'})
export class UserMediaListComponent implements OnInit, OnDestroy {

  userMediaService = inject(UserMediaService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  userMedias?: UserMediaDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@userMedia.delete.success:User Media was removed successfully.`    };
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
    this.userMediaService.getAllUserMedias()
        .subscribe({
          next: (data) => this.userMedias = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.userMediaService.deleteUserMedia(id)
        .subscribe({
          next: () => this.router.navigate(['/userMedias'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
