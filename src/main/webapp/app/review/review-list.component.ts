import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ReviewService } from 'app/review/review.service';
import { ReviewDTO } from 'app/review/review.model';


@Component({
  selector: 'app-review-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './review-list.component.html'})
export class ReviewListComponent implements OnInit, OnDestroy {

  reviewService = inject(ReviewService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  reviews?: ReviewDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@review.delete.success:Review was removed successfully.`    };
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
    this.reviewService.getAllReviews()
        .subscribe({
          next: (data) => this.reviews = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.reviewService.deleteReview(id)
        .subscribe({
          next: () => this.router.navigate(['/reviews'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
