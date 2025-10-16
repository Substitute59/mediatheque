package com.mediatheque.mediatheque.rest;

import com.mediatheque.mediatheque.model.TagDTO;
import com.mediatheque.mediatheque.service.TagService;
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
@RequestMapping(value = "/api/tags", produces = MediaType.APPLICATION_JSON_VALUE)
public class TagResource {

    private final TagService tagService;

    public TagResource(final TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<TagDTO>> getAllTags() {
        return ResponseEntity.ok(tagService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagDTO> getTag(@PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(tagService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createTag(@RequestBody @Valid final TagDTO tagDTO) {
        final Integer createdId = tagService.create(tagDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateTag(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final TagDTO tagDTO) {
        tagService.update(id, tagDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable(name = "id") final Integer id) {
        tagService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
