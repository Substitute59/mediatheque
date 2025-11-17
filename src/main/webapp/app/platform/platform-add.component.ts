import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PlatformService } from './platform.service';
import { PlatformDTO } from './platform.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NotificationService } from '../notification/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-platform-add',
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
  templateUrl: './platform-add.component.html'
})
export class PlatformAddComponent {
  visible: boolean = false;
  name: string = '';
  errorName: string = '';
  errorMessage: string = '';
  loading:boolean = false;
  @Output() savePlatform = new EventEmitter<void>();
  
  constructor(
    private platformService: PlatformService,
    private notif: NotificationService
  ) {}

  addPlatform() {
    let hasError: boolean = false;
    if (this.name === '') {
      this.errorName = $localize`:@@platform.add.name.error:Vous devez renseigner un nom`;
      hasError = true;
    } else {
      this.errorName = '';
    }

    if (hasError) {
      return;
    }
    
    const data = new PlatformDTO({
      name: this.name
    });

    this.loading = true;

    this.platformService.createPlatform(data)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.notif.showSuccess(
            $localize`:@@platform.add.success.title:Plateforme ajoutée !`,
            $localize`:@@platform.add.success.text:Elle sera désormais visible dans la liste.`,
          );
          this.savePlatform.emit();
          this.visible = false;
        },
        error: () => this.errorMessage = $localize`:@@platform.add.error:Une erreur est survenue !`
      });
  }
}
