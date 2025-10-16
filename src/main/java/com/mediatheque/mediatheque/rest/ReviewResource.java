package com.mediatheque.mediatheque.rest;

import com.mediatheque.mediatheque.model.ReviewDTO;
import com.mediatheque.mediatheque.service.MediaService;
import com.mediatheque.mediatheque.service.ReviewService;
import com.mediatheque.mediatheque.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/reviews", produces = MediaType.APPLICATION_JSON_VALUE)
public class ReviewResource {

    private final ReviewService reviewService;
    private final MediaService mediaService;
    private final UserService userService;

    public ReviewResource(final ReviewService reviewService, final MediaService mediaService,
            final UserService userService) {
        this.reviewService = reviewService;
        this.mediaService = mediaService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        return ResponseEntity.ok(reviewService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getReview(@PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(reviewService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createReview(@RequestBody @Valid final ReviewDTO reviewDTO) {
        final Integer createdId = reviewService.create(reviewDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateReview(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final ReviewDTO reviewDTO) {
        reviewService.update(id, reviewDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable(name = "id") final Integer id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mediaValues")
    public ResponseEntity<Map<Integer, String>> getMediaValues() {
        return ResponseEntity.ok(mediaService.getMediaValues());
    }

    @GetMapping("/userValues")
    public ResponseEntity<Map<Integer, String>> getUserValues() {
        return ResponseEntity.ok(userService.getUserValues());
    }

}
