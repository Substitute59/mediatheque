package com.mediatheque.mediatheque.rest;

import com.mediatheque.mediatheque.model.ArtistDTO;
import com.mediatheque.mediatheque.service.ArtistService;
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
@RequestMapping(value = "/api/artists", produces = MediaType.APPLICATION_JSON_VALUE)
public class ArtistResource {

    private final ArtistService artistService;

    public ArtistResource(final ArtistService artistService) {
        this.artistService = artistService;
    }

    @GetMapping
    public ResponseEntity<List<ArtistDTO>> getAllArtists() {
        return ResponseEntity.ok(artistService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtistDTO> getArtist(@PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(artistService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createArtist(@RequestBody @Valid final ArtistDTO artistDTO) {
        final Integer createdId = artistService.create(artistDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateArtist(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final ArtistDTO artistDTO) {
        artistService.update(id, artistDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtist(@PathVariable(name = "id") final Integer id) {
        artistService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
