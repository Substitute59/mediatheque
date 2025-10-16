package com.mediatheque.mediatheque.rest;

import com.mediatheque.mediatheque.model.CollectionDTO;
import com.mediatheque.mediatheque.service.CollectionService;
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
@RequestMapping(value = "/api/collections", produces = MediaType.APPLICATION_JSON_VALUE)
public class CollectionResource {

    private final CollectionService collectionService;

    public CollectionResource(final CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @GetMapping
    public ResponseEntity<List<CollectionDTO>> getAllCollections() {
        return ResponseEntity.ok(collectionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionDTO> getCollection(
            @PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(collectionService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createCollection(
            @RequestBody @Valid final CollectionDTO collectionDTO) {
        final Integer createdId = collectionService.create(collectionDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateCollection(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final CollectionDTO collectionDTO) {
        collectionService.update(id, collectionDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable(name = "id") final Integer id) {
        collectionService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
