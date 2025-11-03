package com.mediatheque.mediatheque.model;

import com.mediatheque.mediatheque.domain.MediaCollection;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class MediaCollectionDTO {

    private Integer id;

    private Integer position;

    @Size(max = 100)
    private String type;

    @NotNull
    private Integer media;

    @NotNull
    private Integer collection;

    public MediaCollectionDTO() {}

    public MediaCollectionDTO(MediaCollection mediaCollection) {
        this.id = mediaCollection.getId();
        this.position = mediaCollection.getPosition();
        this.type = mediaCollection.getType();
    }

    public Integer getId() {
        return id;
    }

    public void setId(final Integer id) {
        this.id = id;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(final Integer position) {
        this.position = position;
    }

    public String getType() {
        return type;
    }

    public void setType(final String type) {
        this.type = type;
    }

    public Integer getMedia() {
        return media;
    }

    public void setMedia(final Integer media) {
        this.media = media;
    }

    public Integer getCollection() {
        return collection;
    }

    public void setCollection(final Integer collection) {
        this.collection = collection;
    }

}
