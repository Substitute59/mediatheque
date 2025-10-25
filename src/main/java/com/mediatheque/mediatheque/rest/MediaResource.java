package com.mediatheque.mediatheque.rest;

import com.mediatheque.mediatheque.model.MediaDTO;
import com.mediatheque.mediatheque.service.GenreService;
import com.mediatheque.mediatheque.service.MediaService;
import com.mediatheque.mediatheque.service.MediaTypeService;
import com.mediatheque.mediatheque.service.PlatformService;
import com.mediatheque.mediatheque.service.TagService;
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
@RequestMapping(value = "/api/medias", produces = MediaType.APPLICATION_JSON_VALUE)
public class MediaResource {

    private final MediaService mediaService;
    private final MediaTypeService mediaTypeService;
    private final GenreService genreService;
    private final PlatformService platformService;
    private final UserService userService;
    private final TagService tagService;

    public MediaResource(final MediaService mediaService, final MediaTypeService mediaTypeService,
            final GenreService genreService, final PlatformService platformService,
            final UserService userService, final TagService tagService) {
        this.mediaService = mediaService;
        this.mediaTypeService = mediaTypeService;
        this.genreService = genreService;
        this.platformService = platformService;
        this.userService = userService;
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<MediaDTO>> getAllMedias() {
        return ResponseEntity.ok(mediaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaDTO> getMedia(@PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(mediaService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createMedia(@RequestBody @Valid final MediaDTO mediaDTO) {
        final Integer createdId = mediaService.create(mediaDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateMedia(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final MediaDTO mediaDTO) {
        mediaService.update(id, mediaDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable(name = "id") final Integer id) {
        mediaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mediaTypeValues")
    public ResponseEntity<Map<Integer, String>> getMediaTypeValues() {
        return ResponseEntity.ok(mediaTypeService.getMediaTypeValues());
    }

    @GetMapping("/genreValues")
    public ResponseEntity<Map<Integer, String>> getGenreValues() {
        return ResponseEntity.ok(genreService.getGenreValues());
    }

    @GetMapping("/platformValues")
    public ResponseEntity<Map<Integer, String>> getPlatformValues() {
        return ResponseEntity.ok(platformService.getPlatformValues());
    }

    @GetMapping("/createdByValues")
    public ResponseEntity<Map<Integer, String>> getCreatedByValues() {
        return ResponseEntity.ok(userService.getUserValues());
    }

    @GetMapping("/mediaTagTagsValues")
    public ResponseEntity<Map<Integer, String>> getMediaTagTagsValues() {
        return ResponseEntity.ok(tagService.getTagValues());
    }

}
