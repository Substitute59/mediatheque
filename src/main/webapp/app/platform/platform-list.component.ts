import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { PlatformService } from 'app/platform/platform.service';
import { PlatformDTO } from 'app/platform/platform.model';


@Component({
  selector: 'app-platform-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './platform-list.component.html'})
export class PlatformListComponent implements OnInit, OnDestroy {

  platformService = inject(PlatformService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  platforms?: PlatformDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@platform.delete.success:Platform was removed successfully.`,
      'platform.media.platform.referenced': $localize`:@@platform.media.platform.referenced:This entity is still referenced by Media ${details?.id} via field Platform.`
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
    this.platformService.getAllPlatforms()
        .subscribe({
          next: (data) => this.platforms = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.platformService.deletePlatform(id)
        .subscribe({
          next: () => this.router.navigate(['/platforms'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/platforms'], {
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
