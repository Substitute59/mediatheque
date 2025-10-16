package com.mediatheque.mediatheque.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class MediaArtistDTO {

    private Integer id;

    @Size(max = 100)
    private String role;

    @NotNull
    private Integer media;

    @NotNull
    private Integer artist;

    public Integer getId() {
        return id;
    }

    public void setId(final Integer id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(final String role) {
        this.role = role;
    }

    public Integer getMedia() {
        return media;
    }

    public void setMedia(final Integer media) {
        this.media = media;
    }

    public Integer getArtist() {
        return artist;
    }

    public void setArtist(final Integer artist) {
        this.artist = artist;
    }

}
