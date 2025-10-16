import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MediaArtistService } from 'app/media-artist/media-artist.service';
import { MediaArtistDTO } from 'app/media-artist/media-artist.model';


@Component({
  selector: 'app-media-artist-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './media-artist-list.component.html'})
export class MediaArtistListComponent implements OnInit, OnDestroy {

  mediaArtistService = inject(MediaArtistService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  mediaArtists?: MediaArtistDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@mediaArtist.delete.success:Media Artist was removed successfully.`    };
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
    this.mediaArtistService.getAllMediaArtists()
        .subscribe({
          next: (data) => this.mediaArtists = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.mediaArtistService.deleteMediaArtist(id)
        .subscribe({
          next: () => this.router.navigate(['/mediaArtists'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
