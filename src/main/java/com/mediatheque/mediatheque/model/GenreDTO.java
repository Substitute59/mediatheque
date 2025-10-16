package com.mediatheque.mediatheque.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class GenreDTO {

    private Integer id;

    @NotNull
    @Size(max = 100)
    private String name;

    @NotNull
    private Integer mediaType;

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
