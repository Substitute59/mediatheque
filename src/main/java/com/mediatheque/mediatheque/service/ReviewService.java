package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.Media;
import com.mediatheque.mediatheque.domain.Review;
import com.mediatheque.mediatheque.domain.User;
import com.mediatheque.mediatheque.events.BeforeDeleteMedia;
import com.mediatheque.mediatheque.events.BeforeDeleteUser;
import com.mediatheque.mediatheque.model.ReviewDTO;
import com.mediatheque.mediatheque.repos.MediaRepository;
import com.mediatheque.mediatheque.repos.ReviewRepository;
import com.mediatheque.mediatheque.repos.UserRepository;
import com.mediatheque.mediatheque.util.NotFoundException;
import com.mediatheque.mediatheque.util.ReferencedException;
import java.util.List;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;

    public ReviewService(final ReviewRepository reviewRepository,
            final MediaRepository mediaRepository, final UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.mediaRepository = mediaRepository;
        this.userRepository = userRepository;
    }

    public List<ReviewDTO> findAll() {
        final List<Review> reviews = reviewRepository.findAll(Sort.by("id"));
        return reviews.stream()
                .map(review -> mapToDTO(review, new ReviewDTO()))
                .toList();
    }

    public ReviewDTO get(final Integer id) {
        return reviewRepository.findById(id)
                .map(review -> mapToDTO(review, new ReviewDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final ReviewDTO reviewDTO) {
        final Review review = new Review();
        mapToEntity(reviewDTO, review);
        return reviewRepository.save(review).getId();
    }

    public void update(final Integer id, final ReviewDTO reviewDTO) {
        final Review review = reviewRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(reviewDTO, review);
        reviewRepository.save(review);
    }

    public void delete(final Integer id) {
        final Review review = reviewRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        reviewRepository.delete(review);
    }

    private ReviewDTO mapToDTO(final Review review, final ReviewDTO reviewDTO) {
        reviewDTO.setId(review.getId());
        reviewDTO.setRating(review.getRating());
        reviewDTO.setComment(review.getComment());
        reviewDTO.setCreatedAt(review.getCreatedAt());
        reviewDTO.setMedia(review.getMedia() == null ? null : review.getMedia().getId());
        reviewDTO.setUser(review.getUser() == null ? null : review.getUser().getId());
        return reviewDTO;
    }

    private Review mapToEntity(final ReviewDTO reviewDTO, final Review review) {
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setCreatedAt(reviewDTO.getCreatedAt());
        final Media media = reviewDTO.getMedia() == null ? null : mediaRepository.findById(reviewDTO.getMedia())
                .orElseThrow(() -> new NotFoundException("media not found"));
        review.setMedia(media);
        final User user = reviewDTO.getUser() == null ? null : userRepository.findById(reviewDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        review.setUser(user);
        return review;
    }

    @EventListener(BeforeDeleteMedia.class)
    public void on(final BeforeDeleteMedia event) {
        final ReferencedException referencedException = new ReferencedException();
        final Review mediaReview = reviewRepository.findFirstByMediaId(event.getId());
        if (mediaReview != null) {
            referencedException.setKey("media.review.media.referenced");
            referencedException.addParam(mediaReview.getId());
            throw referencedException;
        }
    }

    @EventListener(BeforeDeleteUser.class)
    public void on(final BeforeDeleteUser event) {
        final ReferencedException referencedException = new ReferencedException();
        final Review userReview = reviewRepository.findFirstByUserId(event.getId());
        if (userReview != null) {
            referencedException.setKey("user.review.user.referenced");
            referencedException.addParam(userReview.getId());
            throw referencedException;
        }
    }

}
