import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { GenreService } from 'app/genre/genre.service';
import { GenreDTO } from 'app/genre/genre.model';


@Component({
  selector: 'app-genre-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './genre-list.component.html'})
export class GenreListComponent implements OnInit, OnDestroy {

  genreService = inject(GenreService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  genres?: GenreDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@genre.delete.success:Genre was removed successfully.`,
      'genre.media.genre.referenced': $localize`:@@genre.media.genre.referenced:This entity is still referenced by Media ${details?.id} via field Genre.`
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
    this.genreService.getAllGenres()
        .subscribe({
          next: (data) => this.genres = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.genreService.deleteGenre(id)
        .subscribe({
          next: () => this.router.navigate(['/genres'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/genres'], {
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
