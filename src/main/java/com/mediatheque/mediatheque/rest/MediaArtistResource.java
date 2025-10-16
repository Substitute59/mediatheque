package com.mediatheque.mediatheque.rest;

import com.mediatheque.mediatheque.model.MediaArtistDTO;
import com.mediatheque.mediatheque.service.ArtistService;
import com.mediatheque.mediatheque.service.MediaArtistService;
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
@RequestMapping(value = "/api/mediaArtists", produces = MediaType.APPLICATION_JSON_VALUE)
public class MediaArtistResource {

    private final MediaArtistService mediaArtistService;
    private final MediaService mediaService;
    private final ArtistService artistService;

    public MediaArtistResource(final MediaArtistService mediaArtistService,
            final MediaService mediaService, final ArtistService artistService) {
        this.mediaArtistService = mediaArtistService;
        this.mediaService = mediaService;
        this.artistService = artistService;
    }

    @GetMapping
    public ResponseEntity<List<MediaArtistDTO>> getAllMediaArtists() {
        return ResponseEntity.ok(mediaArtistService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaArtistDTO> getMediaArtist(
            @PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(mediaArtistService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createMediaArtist(
            @RequestBody @Valid final MediaArtistDTO mediaArtistDTO) {
        final Integer createdId = mediaArtistService.create(mediaArtistDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateMediaArtist(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final MediaArtistDTO mediaArtistDTO) {
        mediaArtistService.update(id, mediaArtistDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMediaArtist(@PathVariable(name = "id") final Integer id) {
        mediaArtistService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mediaValues")
    public ResponseEntity<Map<Integer, String>> getMediaValues() {
        return ResponseEntity.ok(mediaService.getMediaValues());
    }

    @GetMapping("/artistValues")
    public ResponseEntity<Map<Integer, String>> getArtistValues() {
        return ResponseEntity.ok(artistService.getArtistValues());
    }

}
