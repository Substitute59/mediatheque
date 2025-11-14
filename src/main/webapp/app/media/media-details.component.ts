import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MediaDTO } from './media.model';
import { ReviewDTO } from '../review/review.model';
import { MediaService } from './media.service';
import { MediaUtilsService } from './media-utils.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ErrorHandler } from '../common/error-handler.injectable';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { environment } from 'environments/environment';
import { ReviewAddComponent } from '../review/review-add.component';

@Component({
  selector: 'app-media-details',
  imports: [
    CommonModule,
    CardModule,
    ChipModule,
    ConfirmDialogModule,
    DividerModule,
    TagModule,
    ButtonModule,
    ToastModule,
    RouterLink,
    ReviewAddComponent
  ],
  templateUrl: './media-details.component.html',
  styleUrl: './media-details.component.css',
  providers: [ConfirmationService]
})
export class MediaDetailsComponent {
  currentId?: number;
  media?: MediaDTO;
  fallbackImgUrl: string = $localize`:@@media.img.default:https://placehold.co/600x400?text=Sans+Image`;
  errorMessage?: string;
  myReview?: ReviewDTO;
  environment = environment;

  constructor(
    private mediaService: MediaService,
    public mediaUtilsService: MediaUtilsService,
    private auth: AuthService,
    private errorHandler: ErrorHandler,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private location: Location
  ) {
    this.loadMedia()
  }

  getBack() {
    this.location.back();
  }

  loadMedia() {
    this.currentId = +this.route.snapshot.params['id'];
    this.mediaService.getMedia(this.currentId, this.auth.currentUserValue?.id!)
      .subscribe({
        next: (data: MediaDTO) => {
          this.media = data;
          this.myReview = this.mediaUtilsService.getMyReview(this.media!) as ReviewDTO;
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      })
  }

  getWishlistIcon(media: MediaDTO): string {
    return `pi pi-${media.inUserMediaLibrary && media?.flag?.id === 2 ? 'heart-fill' : 'heart'}`;
  }
  
  getLoanIcon(media: MediaDTO): string {
    return `pi pi-${media?.flag?.id === 3 ? 'download' : 'upload'}`;
  }

  getCurrentUserId() {
    return this.auth.currentUserValue?.id!;
  }

  errorFunction(errorMessage: string) {
    this.errorMessage = errorMessage;
  }

  addToMyMediaLibrary(media: MediaDTO) {
    this.mediaUtilsService.upsertUserMedia(
      media,
      'add',
      $localize`:@@media.list.add.confirmation:Média ajouté !`,
      $localize`:@@media.list.add.confirmation.detail:Vous pouvez le retrouver dans votre médiathèque.`,
      (userMediaId: number) => {
        this.media!.flag = {
          id: 1
        };
        this.media!.userMediaId = userMediaId;
        this.media!.inUserMediaLibrary = true;
      },
      this.errorFunction
    );
  }

  toggleFromMyWishlist(media: MediaDTO) {
    let title = $localize`:@@media.list.add.confirmation:Média ajouté à votre wishlist !`;
    let text = $localize`:@@media.list.add.confirmation.wishlist:Vous pouvez le retrouver dans votre wishlist.`;
    let callback = (userMediaId: number) => {
      this.media!.flag = {
        id: 2
      };
      this.media!.userMediaId = userMediaId;
      this.media!.inUserMediaLibrary = true;
    };

    if (media.inUserMediaLibrary && media?.flag?.id === 2) {
      title = $localize`:@@media.list.remove.confirmation:Média retiré de votre wishlist !`;
      text = $localize`:@@media.list.remove.confirmation.detail:Vous pouvez le retrouver dans la recherche si vous voulez l'ajouter à nouveau plus tard.`;
      callback = () => {
        this.media!.flag = undefined;
        this.media!.userMediaId = undefined;
        this.media!.inUserMediaLibrary = false;
      };
    }

    this.mediaUtilsService.upsertUserMedia(
      media,
      'wishlist',
      title,
      text,
      callback,
      this.errorFunction
    );
  }

  updateStatus(media: MediaDTO) {
    const newFlagId: number = media.flag?.id === 1 ? 3 : 1;
    const text = newFlagId === 3
      ? $localize`:@@media.list.loan.confirmation.wishlist:Vous avez prêté ce média.`
      : $localize`:@@media.list.loan.confirmation.wishlist:Vous avez récupéré ce média.`
    this.mediaUtilsService.upsertUserMedia(
      media,
      'loan',
      $localize`:@@media.list.loan.confirmation:Status mis à jour !`,
      text,
      (userMediaId: number) => {
        this.media!.flag = {
          id: newFlagId
        };
        this.media!.userMediaId = userMediaId;
      },
      this.errorFunction
    );
  }

  confirmDelete(event: Event, media: MediaDTO) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: $localize`:@@media.list.delete.confirm:Êtes-vous certain de vouloir supprimer ce média de votre médiathèque ?`,
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: $localize`:@@media.list.delete.confirm.cancel:Annuler`,
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: $localize`:@@media.list.delete.confirm.validate:Valider`
      },
      accept: () => {
        this.mediaUtilsService.upsertUserMedia(
          media,
          'remove',
          $localize`:@@media.list.delete.confirmation:Média supprimé de votre médiathèque !`,
          $localize`:@@media.list.delete.confirmation:Il reste disponible dans la recherche si vous voulez l'ajouter à nouveau plus tard.`,
          () => {
            this.media!.flag = undefined;
            this.media!.userMediaId = undefined;
            this.media!.inUserMediaLibrary = false;
          },
          this.errorFunction
        );
      },
      reject: () => {},
    });
  }
}
