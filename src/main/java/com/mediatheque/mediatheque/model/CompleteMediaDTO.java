package com.mediatheque.mediatheque.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.List;


public class CompleteMediaDTO {

    private Integer id;

    @NotNull
    @Size(max = 255)
    private String title;

    private String description;

    @Size(max = 500)
    private String coverUrl;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    private FlagDTO flag;

    private MediaTypeDTO mediaType;

    private GenreDTO genre;

    private PlatformDTO platform;

    private UserDTO createdBy;

    private List<TagDTO> mediaTagTags;

    private List<ArtistDTO> mediaMediaArtists;

    private List<CollectionDTO> mediaMediaCollections;

    private List<ReviewDTO> mediaReviews;

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

    public FlagDTO getFlag() {
        return flag;
    }

    public void setFlag(final FlagDTO flag) {
        this.flag = flag;
    }

    public MediaTypeDTO getMediaType() {
        return mediaType;
    }

    public void setMediaType(final MediaTypeDTO mediaType) {
        this.mediaType = mediaType;
    }

    public GenreDTO getGenre() {
        return genre;
    }

    public void setGenre(final GenreDTO genre) {
        this.genre = genre;
    }

    public PlatformDTO getPlatform() {
        return platform;
    }

    public void setPlatform(final PlatformDTO platform) {
        this.platform = platform;
    }

    public UserDTO getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(final UserDTO createdBy) {
        this.createdBy = createdBy;
    }

    public List<TagDTO> getMediaTagTags() {
        return mediaTagTags;
    }

    public void setMediaTagTags(final List<TagDTO> mediaTagTags) {
        this.mediaTagTags = mediaTagTags;
    }

    public List<ArtistDTO> getMediaMediaArtists() {
        return mediaMediaArtists;
    }

    public void setMediaMediaArtists(final List<ArtistDTO> mediaMediaArtists) {
        this.mediaMediaArtists = mediaMediaArtists;
    }

    public List<CollectionDTO> getMediaMediaCollections() {
        return mediaMediaCollections;
    }

    public void setMediaMediaCollections(final List<CollectionDTO> mediaMediaCollections) {
        this.mediaMediaCollections = mediaMediaCollections;
    }
    public List<ReviewDTO> getMediaReviews() {
        return mediaReviews;
    }

    public void setMediaReviews(final List<ReviewDTO> mediaReviews) {
        this.mediaReviews = mediaReviews;
    }

}
