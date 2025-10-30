import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MediaTypeService } from 'app/media-type/media-type.service';
import { MediaTypeDTO } from 'app/media-type/media-type.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-media-type-list',
  imports: [CommonModule, CardModule, RouterLink],
  templateUrl: './media-type-list.component.html',
  styleUrl: './media-type-list.component.scss'
})
export class MediaTypeListComponent {
  mediaTypes?: MediaTypeDTO[];

  constructor(private mediaTypeService: MediaTypeService, private errorHandler: ErrorHandler) {
    this.mediaTypeService.getAllMediaTypes()
      .subscribe({
        next: (data) => this.mediaTypes = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }
}
