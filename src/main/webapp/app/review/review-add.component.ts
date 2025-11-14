import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReviewService } from './review.service';
import { ReviewDTO } from './review.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { RatingModule } from 'primeng/rating';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-review-add',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TextareaModule,
    RatingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './review-add.component.html'
})
export class ReviewAddComponent {
  visible: boolean = false;
  rating: number = 0;
  comment: string = '';
  errorRating: string = '';
  errorComment: string = '';
  errorMessage: string = '';
  mediaId = input<number>();
  userId = input<number>();
  @Output() saveReview = new EventEmitter<void>();
  
  constructor(
    private reviewService: ReviewService,
    private notif: NotificationService,
    private location: Location
  ) {}

  addReview() {
    let hasError: boolean = false;
    if (this.rating === 0) {
      this.errorRating = $localize`:@@review.add.rating.error:Vous devez donner une note`;
      hasError = true;
    } else {
      this.errorRating = '';
    }
    if (this.comment === '') {
      this.errorComment = $localize`:@@review.add.comment.error:Vous devez rédiger votre avis`;
      hasError = true;
    } else {
      this.errorComment = '';
    }

    if (hasError) {
      return;
    }
    
    const data = new ReviewDTO({
      rating: this.rating,
      comment: this.comment,
      createdAt: new Date().toISOString(),
      media: this.mediaId(),
      user: this.userId()
    });

    this.reviewService.createReview(data)
      .subscribe({
        next: () => {
          this.notif.showSuccess(
            $localize`:@@review.add.success.title:Avis ajouté !`,
            $localize`:@@review.add.success.text:Il sera désormais visible sur ce média.`,
          );
          this.saveReview.emit();
          this.visible = false;
        },
        error: (error) => this.errorMessage = $localize`:@@review.add.error:Une erreur est survenue !`
      });
  }
}
