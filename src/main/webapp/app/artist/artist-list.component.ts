import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ArtistService } from 'app/artist/artist.service';
import { ArtistDTO } from 'app/artist/artist.model';


@Component({
  selector: 'app-artist-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './artist-list.component.html'})
export class ArtistListComponent implements OnInit, OnDestroy {

  artistService = inject(ArtistService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  artists?: ArtistDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@artist.delete.success:Artist was removed successfully.`,
      'artist.mediaArtist.artist.referenced': $localize`:@@artist.mediaArtist.artist.referenced:This entity is still referenced by Media Artist ${details?.id} via field Artist.`
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
    this.artistService.getAllArtists()
        .subscribe({
          next: (data) => this.artists = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.artistService.deleteArtist(id)
        .subscribe({
          next: () => this.router.navigate(['/artists'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/artists'], {
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
