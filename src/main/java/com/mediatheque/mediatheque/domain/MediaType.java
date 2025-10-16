package com.mediatheque.mediatheque.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.HashSet;
import java.util.Set;


@Entity
public class MediaType {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @OneToMany(mappedBy = "mediaType")
    private Set<Genre> mediaTypeGenres = new HashSet<>();

    @OneToMany(mappedBy = "mediaType")
    private Set<Media> mediaTypeMedias = new HashSet<>();

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

    public Set<Genre> getMediaTypeGenres() {
        return mediaTypeGenres;
    }

    public void setMediaTypeGenres(final Set<Genre> mediaTypeGenres) {
        this.mediaTypeGenres = mediaTypeGenres;
    }

    public Set<Media> getMediaTypeMedias() {
        return mediaTypeMedias;
    }

    public void setMediaTypeMedias(final Set<Media> mediaTypeMedias) {
        this.mediaTypeMedias = mediaTypeMedias;
    }

}
