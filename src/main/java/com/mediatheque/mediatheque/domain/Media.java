package com.mediatheque.mediatheque.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;


@Entity
public class Media {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "longtext", name = "\"description\"")
    private String description;

    @Column(length = 500)
    private String coverUrl;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "media_type_id", nullable = false)
    private MediaType mediaType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id")
    private Genre genre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "platform_id")
    private Platform platform;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @OneToMany(mappedBy = "media")
    private Set<MediaArtist> mediaMediaArtists = new HashSet<>();

    @OneToMany(mappedBy = "media")
    private Set<MediaCollection> mediaMediaCollections = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "MediaTag",
            joinColumns = @JoinColumn(name = "mediaId"),
            inverseJoinColumns = @JoinColumn(name = "tagId")
    )
    private Set<Tag> mediaTagTags = new HashSet<>();

    @OneToMany(mappedBy = "media")
    private Set<Review> mediaReviews = new HashSet<>();

    @OneToMany(mappedBy = "media")
    private Set<UserMedia> mediaUserMedias = new HashSet<>();

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

    public MediaType getMediaType() {
        return mediaType;
    }

    public void setMediaType(final MediaType mediaType) {
        this.mediaType = mediaType;
    }

    public Genre getGenre() {
        return genre;
    }

    public void setGenre(final Genre genre) {
        this.genre = genre;
    }

    public Platform getPlatform() {
        return platform;
    }

    public void setPlatform(final Platform platform) {
        this.platform = platform;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(final User createdBy) {
        this.createdBy = createdBy;
    }

    public Set<MediaArtist> getMediaMediaArtists() {
        return mediaMediaArtists;
    }

    public void setMediaMediaArtists(final Set<MediaArtist> mediaMediaArtists) {
        this.mediaMediaArtists = mediaMediaArtists;
    }

    public Set<MediaCollection> getMediaMediaCollections() {
        return mediaMediaCollections;
    }

    public void setMediaMediaCollections(final Set<MediaCollection> mediaMediaCollections) {
        this.mediaMediaCollections = mediaMediaCollections;
    }

    public Set<Tag> getMediaTagTags() {
        return mediaTagTags;
    }

    public void setMediaTagTags(final Set<Tag> mediaTagTags) {
        this.mediaTagTags = mediaTagTags;
    }

    public Set<Review> getMediaReviews() {
        return mediaReviews;
    }

    public void setMediaReviews(final Set<Review> mediaReviews) {
        this.mediaReviews = mediaReviews;
    }

    public Set<UserMedia> getMediaUserMedias() {
        return mediaUserMedias;
    }

    public void setMediaUserMedias(final Set<UserMedia> mediaUserMedias) {
        this.mediaUserMedias = mediaUserMedias;
    }

}
