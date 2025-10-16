import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ReviewService } from 'app/review/review.service';
import { ReviewDTO } from 'app/review/review.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-review-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './review-add.component.html'
})
export class ReviewAddComponent implements OnInit {

  reviewService = inject(ReviewService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  mediaValues?: Map<number,string>;
  userValues?: Map<number,string>;

  addForm = new FormGroup({
    rating: new FormControl(null, [Validators.required]),
    comment: new FormControl(null),
    createdAt: new FormControl(null, [validOffsetDateTime]),
    media: new FormControl(null, [Validators.required]),
    user: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@review.create.success:Review was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
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
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ReviewDTO(this.addForm.value);
    this.reviewService.createReview(data)
        .subscribe({
          next: () => this.router.navigate(['/reviews'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
