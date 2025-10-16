import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { TagService } from 'app/tag/tag.service';
import { TagDTO } from 'app/tag/tag.model';


@Component({
  selector: 'app-tag-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './tag-list.component.html'})
export class TagListComponent implements OnInit, OnDestroy {

  tagService = inject(TagService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  tags?: TagDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@tag.delete.success:Tag was removed successfully.`    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }
  
  loadData() {
    this.tagService.getAllTags()
        .subscribe({
          next: (data) => this.tags = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.tagService.deleteTag(id)
        .subscribe({
          next: () => this.router.navigate(['/tags'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
