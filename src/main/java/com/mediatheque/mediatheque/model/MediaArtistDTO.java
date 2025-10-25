package com.mediatheque.mediatheque.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class MediaArtistDTO {

    private Integer id;

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
