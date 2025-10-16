package com.mediatheque.mediatheque.rest;

import com.mediatheque.mediatheque.model.MediaCollectionDTO;
import com.mediatheque.mediatheque.service.CollectionService;
import com.mediatheque.mediatheque.service.MediaCollectionService;
import com.mediatheque.mediatheque.service.MediaService;
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
@RequestMapping(value = "/api/mediaCollections", produces = MediaType.APPLICATION_JSON_VALUE)
public class MediaCollectionResource {

    private final MediaCollectionService mediaCollectionService;
    private final MediaService mediaService;
    private final CollectionService collectionService;

    public MediaCollectionResource(final MediaCollectionService mediaCollectionService,
            final MediaService mediaService, final CollectionService collectionService) {
        this.mediaCollectionService = mediaCollectionService;
        this.mediaService = mediaService;
        this.collectionService = collectionService;
    }

    @GetMapping
    public ResponseEntity<List<MediaCollectionDTO>> getAllMediaCollections() {
        return ResponseEntity.ok(mediaCollectionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaCollectionDTO> getMediaCollection(
            @PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(mediaCollectionService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createMediaCollection(
            @RequestBody @Valid final MediaCollectionDTO mediaCollectionDTO) {
        final Integer createdId = mediaCollectionService.create(mediaCollectionDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateMediaCollection(
            @PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final MediaCollectionDTO mediaCollectionDTO) {
        mediaCollectionService.update(id, mediaCollectionDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMediaCollection(@PathVariable(name = "id") final Integer id) {
        mediaCollectionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mediaValues")
    public ResponseEntity<Map<Integer, String>> getMediaValues() {
        return ResponseEntity.ok(mediaService.getMediaValues());
    }

    @GetMapping("/collectionValues")
    public ResponseEntity<Map<Integer, String>> getCollectionValues() {
        return ResponseEntity.ok(collectionService.getCollectionValues());
    }

}
