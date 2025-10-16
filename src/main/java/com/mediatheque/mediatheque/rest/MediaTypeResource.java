package com.mediatheque.mediatheque.rest;

import com.mediatheque.mediatheque.model.MediaTypeDTO;
import com.mediatheque.mediatheque.service.MediaTypeService;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping(value = "/api/mediaTypes", produces = MediaType.APPLICATION_JSON_VALUE)
public class MediaTypeResource {

    private final MediaTypeService mediaTypeService;

    public MediaTypeResource(final MediaTypeService mediaTypeService) {
        this.mediaTypeService = mediaTypeService;
    }

    @GetMapping
    public ResponseEntity<List<MediaTypeDTO>> getAllMediaTypes() {
        return ResponseEntity.ok(mediaTypeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaTypeDTO> getMediaType(@PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(mediaTypeService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createMediaType(
            @RequestBody @Valid final MediaTypeDTO mediaTypeDTO) {
        final Integer createdId = mediaTypeService.create(mediaTypeDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateMediaType(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final MediaTypeDTO mediaTypeDTO) {
        mediaTypeService.update(id, mediaTypeDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMediaType(@PathVariable(name = "id") final Integer id) {
        mediaTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
