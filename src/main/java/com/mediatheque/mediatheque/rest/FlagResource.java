package com.mediatheque.mediatheque.rest;

import com.mediatheque.mediatheque.model.FlagDTO;
import com.mediatheque.mediatheque.service.FlagService;
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
@RequestMapping(value = "/api/flags", produces = MediaType.APPLICATION_JSON_VALUE)
public class FlagResource {

    private final FlagService flagService;

    public FlagResource(final FlagService flagService) {
        this.flagService = flagService;
    }

    @GetMapping
    public ResponseEntity<List<FlagDTO>> getAllFlags() {
        return ResponseEntity.ok(flagService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlagDTO> getFlag(@PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(flagService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createFlag(@RequestBody @Valid final FlagDTO flagDTO) {
        final Integer createdId = flagService.create(flagDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateFlag(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final FlagDTO flagDTO) {
        flagService.update(id, flagDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlag(@PathVariable(name = "id") final Integer id) {
        flagService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
