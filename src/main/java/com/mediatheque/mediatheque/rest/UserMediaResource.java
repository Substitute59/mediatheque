package com.mediatheque.mediatheque.rest;

import com.mediatheque.mediatheque.model.UserMediaDTO;
import com.mediatheque.mediatheque.service.FlagService;
import com.mediatheque.mediatheque.service.MediaService;
import com.mediatheque.mediatheque.service.UserMediaService;
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
@RequestMapping(value = "/api/userMedias", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserMediaResource {

    private final UserMediaService userMediaService;
    private final UserService userService;
    private final MediaService mediaService;
    private final FlagService flagService;

    public UserMediaResource(final UserMediaService userMediaService, final UserService userService,
            final MediaService mediaService, final FlagService flagService) {
        this.userMediaService = userMediaService;
        this.userService = userService;
        this.mediaService = mediaService;
        this.flagService = flagService;
    }

    @GetMapping
    public ResponseEntity<List<UserMediaDTO>> getAllUserMedias() {
        return ResponseEntity.ok(userMediaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserMediaDTO> getUserMedia(@PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(userMediaService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createUserMedia(
            @RequestBody @Valid final UserMediaDTO userMediaDTO) {
        final Integer createdId = userMediaService.create(userMediaDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateUserMedia(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final UserMediaDTO userMediaDTO) {
        userMediaService.update(id, userMediaDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserMedia(@PathVariable(name = "id") final Integer id) {
        userMediaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/userValues")
    public ResponseEntity<Map<Integer, String>> getUserValues() {
        return ResponseEntity.ok(userService.getUserValues());
    }

    @GetMapping("/mediaValues")
    public ResponseEntity<Map<Integer, String>> getMediaValues() {
        return ResponseEntity.ok(mediaService.getMediaValues());
    }

    @GetMapping("/flagValues")
    public ResponseEntity<Map<Integer, String>> getFlagValues() {
        return ResponseEntity.ok(flagService.getFlagValues());
    }

}
