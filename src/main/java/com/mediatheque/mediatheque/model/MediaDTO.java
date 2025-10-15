package com.mediatheque.mediatheque.model;

import jakarta.validation.constraints.Size;


public class MediaDTO {

    private Long id;

    @Size(max = 255)
    private String title;

    @Size(max = 255)
    private String type;

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(final String type) {
        this.type = type;
    }

}
