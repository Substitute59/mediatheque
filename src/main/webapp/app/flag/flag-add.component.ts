import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { FlagService } from 'app/flag/flag.service';
import { FlagDTO } from 'app/flag/flag.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-flag-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './flag-add.component.html'
})
export class FlagAddComponent {

  flagService = inject(FlagService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    color: new FormControl(null, [Validators.maxLength(50)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@flag.create.success:Flag was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new FlagDTO(this.addForm.value);
    this.flagService.createFlag(data)
        .subscribe({
          next: () => this.router.navigate(['/flags'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
