package com.mediatheque.mediatheque.model;

import com.mediatheque.mediatheque.domain.MediaType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class MediaTypeDTO {

    private Integer id;

    @NotNull
    @Size(max = 100)
    private String name;

    @NotNull
    @Size(max = 100)
    private String icon;

    private Integer numberOfMedias;

    public MediaTypeDTO() {}

    public MediaTypeDTO(MediaType mediaType) {
        this.id = mediaType.getId();
        this.name = mediaType.getName();
        this.icon = mediaType.getIcon();
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

    public String getIcon() {
        return icon;
    }

    public void setIcon(final String icon) {
        this.icon = icon;
    }

    public Integer getNumberOfMedias() {
        return numberOfMedias;
    }

    public void setNumberOfMedias(final Integer numberOfMedias) {
        this.numberOfMedias = numberOfMedias;
    }

}
