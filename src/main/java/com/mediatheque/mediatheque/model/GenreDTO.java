package com.mediatheque.mediatheque.model;

import com.mediatheque.mediatheque.domain.Genre;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class GenreDTO {

    private Integer id;

    @NotNull
    @Size(max = 100)
    private String name;

    @NotNull
    private Integer mediaType;

    public GenreDTO() {}

    public GenreDTO(Genre genre) {
        this.id = genre.getId();
        this.name = genre.getName();
    }

    public Integer getId() {
        return id;
    }

    public void setId(final Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public Integer getMediaType() {
        return mediaType;
    }

    public void setMediaType(final Integer mediaType) {
        this.mediaType = mediaType;
    }

}
