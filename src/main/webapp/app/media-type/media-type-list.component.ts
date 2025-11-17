import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MediaTypeService } from './media-type.service';
import { MediaTypeDTO } from './media-type.model';
import { ErrorHandler } from '../common/error-handler.injectable';
import { CardModule } from 'primeng/card';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-media-type-list',
  imports: [
    CommonModule,
    CardModule,
    RouterLink,
    BlockUIModule,
    ProgressSpinnerModule
  ],
  templateUrl: './media-type-list.component.html',
  styleUrl: './media-type-list.component.scss'
})
export class MediaTypeListComponent {
  mediaTypes?: MediaTypeDTO[];
  loading:boolean = true;

  constructor(private mediaTypeService: MediaTypeService, private errorHandler: ErrorHandler, private auth: AuthService) {
    this.mediaTypeService.getAllMediaTypes(this.auth.currentUserValue?.id!)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => this.mediaTypes = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }
}
