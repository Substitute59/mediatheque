package com.mediatheque.mediatheque.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.List;


public class MediaDTO {

    private Integer id;

    @NotNull
    @Size(max = 255)
    private String title;

    private String description;

    @Size(max = 500)
    private String coverUrl;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    @NotNull
    private Integer mediaType;

    private Integer genre;

    private Integer platform;

    private Integer createdBy;

    private List<Integer> mediaTagTags;

    public Integer getId() {
        return id;
    }

    public void setId(final Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(final String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(final OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(final OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getMediaType() {
        return mediaType;
    }

    public void setMediaType(final Integer mediaType) {
        this.mediaType = mediaType;
    }

    public Integer getGenre() {
        return genre;
    }

    public void setGenre(final Integer genre) {
        this.genre = genre;
    }

    public Integer getPlatform() {
        return platform;
    }

    public void setPlatform(final Integer platform) {
        this.platform = platform;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(final Integer createdBy) {
        this.createdBy = createdBy;
    }

    public List<Integer> getMediaTagTags() {
        return mediaTagTags;
    }

    public void setMediaTagTags(final List<Integer> mediaTagTags) {
        this.mediaTagTags = mediaTagTags;
    }

}
