import { Injectable } from '@angular/core';
import { MediaDTO } from './media.model';
import { ReviewDTO } from '../review/review.model';
import { UserMediaDTO } from '../user-media/user-media.model'
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../notification/notification.service';
import { UserMediaService } from '../user-media/user-media.service';

@Injectable({ providedIn: 'root' })
export class MediaUtilsService {

  constructor(
    private auth: AuthService,
    private notif: NotificationService,
    private userMediaService: UserMediaService
  ) {}

  getArtistNames(media: MediaDTO): string {
    return media.mediaMediaArtists?.map(a => a.name).join(', ') || '';
  }

  getAverageRating(media: MediaDTO): number {
    if (!media.mediaReviews || media.mediaReviews.length === 0) {
      return 0;
    }
    const total = media.mediaReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return total / media.mediaReviews.length;
  }

  getCurrentUserRating(media: MediaDTO): number | null {
    const currentUserId = this.auth.currentUserValue?.id;
    if (!media.mediaReviews || media.mediaReviews.length === 0 || !currentUserId) {
      return null;
    }
    const userReview = media.mediaReviews.find(review => review.user === currentUserId);
    return userReview ? userReview.rating || null : null;
  }

  getOthersReviews(media: MediaDTO): ReviewDTO[] | null {
    return media?.mediaReviews?.filter(review => review.user !== this.auth.currentUserValue?.id) || null;
  }

  getMyReview(media: MediaDTO): ReviewDTO | null {
    return media?.mediaReviews?.find(review => review.user === this.auth.currentUserValue?.id) || null;
  }

  isCreatedByCurrentUser(media: MediaDTO): boolean {
    return media?.createdBy?.id === this.auth.currentUserValue?.id;
  }

  upsertUserMedia(
    media: MediaDTO,
    context: string,
    successTitle: string,
    successText: string,
    callback: (userMediaId: number) => void,
    errorFunction: (errorMessage: string) => void
  ) {
    let flag;
    let action;
    switch (context) {
      case 'add':
        flag = 1;
        action = media.inUserMediaLibrary && media?.flag?.id === 2 ? 'update' : 'create';
        break;
      case 'remove':
        flag = 1;
        action = 'delete';
        break;
      case 'wishlist':
        flag = 2;
        action = media.inUserMediaLibrary && media?.flag?.id === 2 ? 'delete' : 'create';
        break;
      case 'loan':
        flag = media.flag?.id === 1 ? 3 : 1;
        action = 'update';
        break;
    }
    const userMedia: UserMediaDTO = {
      media: media.id,
      user: this.auth.currentUserValue?.id!,
      flag,
      addedDate: new Date().toISOString()
    };
    const nextFunction = (userMediaId: number = 0) => {
      this.notif.showSuccess(
        successTitle,
        successText
      );
      callback(userMediaId)
    }
    switch (action) {
      case 'create':
        this.userMediaService.createUserMedia(userMedia)
          .subscribe({
            next: (userMediaId) => {
              nextFunction(userMediaId)
            },
            error: () => {
              errorFunction($localize`@@media.add.error:Une erreur est survenue lors de l'ajout.`)
            }
          });
        break;
      case 'update':
        this.userMediaService.updateUserMedia(media.userMediaId!, userMedia)
          .subscribe({
            next: (userMediaId) => {
              nextFunction(userMediaId)
            },
            error: () => {
              errorFunction($localize`@@media.update.error:Une erreur est survenue lors de la mise à jour.`)
            }
          });
        break;
      case 'delete':
        this.userMediaService.deleteUserMedia(media.id!, this.auth.currentUserValue?.id!)
          .subscribe({
            next: () => {
              nextFunction(media.id!)
            },
            error: () => {
              errorFunction($localize`@@media.remove.error:Une erreur est survenue lors du retrait.`)
            }
          });
        break;
    }
  }
}
