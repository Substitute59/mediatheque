import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TagService } from './tag.service';
import { TagDTO } from './tag.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-tag-add',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    RatingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './tag-add.component.html'
})
export class TagAddComponent {
  visible: boolean = false;
  names: string[] = [''];
  errors: string[] = [''];
  errorMessage: string = '';
  @Output() saveTag = new EventEmitter<void>();
  
  constructor(
    private tagService: TagService,
    private notif: NotificationService
  ) {}

  addField() {
    this.names.push('');
    this.errors.push('');
  }

  addTag() {
    let valid = true;

    this.errors = this.errors.map(() => '');

    this.names.forEach((name, i) => {
      if (!name || name.trim() === '') {
        this.errors[i] = $localize`:@@tag.add.name.error:Vous devez renseigner un nom`;
        valid = false;
      }
    });

    if (!valid) return;

    const tags = this.names.map(n => new TagDTO({ name: n.trim() }));

    this.tagService.createTags(tags)
      .subscribe({
        next: () => {
          this.notif.showSuccess(
            $localize`:@@tag.add.success.title:Tag(s) ajouté(s) !`,
            $localize`:@@tag.add.success.text:Il(s) sera(ont) désormais visible(s) dans la liste.`,
          );
          this.saveTag.emit();
          this.visible = false;
        },
        error: () => this.errorMessage = $localize`:@@tag.add.error:Une erreur est survenue !`
      });
  }
}
