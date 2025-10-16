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
public class Collection {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "longtext", name = "\"description\"")
    private String description;

    @OneToMany(mappedBy = "collection")
    private Set<MediaCollection> collectionMediaCollections = new HashSet<>();

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

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public Set<MediaCollection> getCollectionMediaCollections() {
        return collectionMediaCollections;
    }

    public void setCollectionMediaCollections(
            final Set<MediaCollection> collectionMediaCollections) {
        this.collectionMediaCollections = collectionMediaCollections;
    }

}
