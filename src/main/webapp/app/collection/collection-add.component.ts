import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CollectionService } from './collection.service';
import { CollectionDTO } from './collection.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NotificationService } from '../notification/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-collection-add',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './collection-add.component.html'
})
export class CollectionAddComponent {
  visible: boolean = false;
  name: string = '';
  errorName: string = '';
  errorMessage: string = '';
  loading:boolean = false;
  @Output() saveCollection = new EventEmitter<void>();
  
  constructor(
    private collectionService: CollectionService,
    private notif: NotificationService
  ) {}

  addCollection() {
    let hasError: boolean = false;
    if (this.name === '') {
      this.errorName = $localize`:@@collection.add.name.error:Vous devez renseigner un nom`;
      hasError = true;
    } else {
      this.errorName = '';
    }

    if (hasError) {
      return;
    }
    
    const data = new CollectionDTO({
      name: this.name
    });

    this.loading = true;

    this.collectionService.createCollection(data)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.notif.showSuccess(
            $localize`:@@collection.add.success.title:Collection ajoutée !`,
            $localize`:@@collection.add.success.text:Elle sera désormais visible dans la liste.`,
          );
          this.saveCollection.emit();
          this.visible = false;
        },
        error: () => this.errorMessage = $localize`:@@collection.add.error:Une erreur est survenue !`
      });
  }
}
