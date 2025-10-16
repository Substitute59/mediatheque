import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { FlagService } from 'app/flag/flag.service';
import { FlagDTO } from 'app/flag/flag.model';


@Component({
  selector: 'app-flag-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './flag-list.component.html'})
export class FlagListComponent implements OnInit, OnDestroy {

  flagService = inject(FlagService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  flags?: FlagDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@flag.delete.success:Flag was removed successfully.`,
      'flag.media.flag.referenced': $localize`:@@flag.media.flag.referenced:This entity is still referenced by Media ${details?.id} via field Flag.`,
      'flag.userMedia.flag.referenced': $localize`:@@flag.userMedia.flag.referenced:This entity is still referenced by User Media ${details?.id} via field Flag.`
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
    this.flagService.getAllFlags()
        .subscribe({
          next: (data) => this.flags = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.flagService.deleteFlag(id)
        .subscribe({
          next: () => this.router.navigate(['/flags'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/flags'], {
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
