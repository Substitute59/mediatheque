import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ReviewService } from 'app/review/review.service';
import { ReviewDTO } from 'app/review/review.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-review-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './review-edit.component.html'
})
export class ReviewEditComponent implements OnInit {

  reviewService = inject(ReviewService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  mediaValues?: Map<number,string>;
  userValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    rating: new FormControl(null, [Validators.required]),
    comment: new FormControl(null),
    createdAt: new FormControl(null, [validOffsetDateTime]),
    media: new FormControl(null, [Validators.required]),
    user: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@review.update.success:Review was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.reviewService.getMediaValues()
        .subscribe({
          next: (data) => this.mediaValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.reviewService.getUserValues()
        .subscribe({
          next: (data) => this.userValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.reviewService.getReview(this.currentId!)
        .subscribe({
          next: (data) => updateForm(this.editForm, data),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new ReviewDTO(this.editForm.value);
    this.reviewService.updateReview(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/reviews'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
