package com.mediatheque.mediatheque.model;

import com.mediatheque.mediatheque.domain.Artist;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class ArtistDTO {

    private Integer id;

    @NotNull
    @Size(max = 150)
    private String name;

    @Size(max = 255)
    private String type;

    public ArtistDTO() {}

    public ArtistDTO(Artist artist) {
        this.id = artist.getId();
        this.name = artist.getName();
        this.type = artist.getType();
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

    public String getType() {
        return type;
    }

    public void setType(final String type) {
        this.type = type;
    }

}
