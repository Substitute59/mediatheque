package com.mediatheque.mediatheque.rest;

import com.mediatheque.mediatheque.model.GenreDTO;
import com.mediatheque.mediatheque.service.GenreService;
import com.mediatheque.mediatheque.service.MediaTypeService;
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
@RequestMapping(value = "/api/genres", produces = MediaType.APPLICATION_JSON_VALUE)
public class GenreResource {

    private final GenreService genreService;
    private final MediaTypeService mediaTypeService;

    public GenreResource(final GenreService genreService, final MediaTypeService mediaTypeService) {
        this.genreService = genreService;
        this.mediaTypeService = mediaTypeService;
    }

    @GetMapping
    public ResponseEntity<List<GenreDTO>> getAllGenres() {
        return ResponseEntity.ok(genreService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenreDTO> getGenre(@PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(genreService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createGenre(@RequestBody @Valid final GenreDTO genreDTO) {
        final Integer createdId = genreService.create(genreDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateGenre(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final GenreDTO genreDTO) {
        genreService.update(id, genreDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGenre(@PathVariable(name = "id") final Integer id) {
        genreService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mediaTypeValues")
    public ResponseEntity<Map<Integer, String>> getMediaTypeValues() {
        return ResponseEntity.ok(mediaTypeService.getMediaTypeValues());
    }

}
