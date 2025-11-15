import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PlatformService } from './platform.service';
import { PlatformDTO } from './platform.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-platform-add',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    RatingModule,
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

    this.platformService.createPlatform(data)
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
