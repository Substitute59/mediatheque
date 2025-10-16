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
public class Flag {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String color;

    @OneToMany(mappedBy = "flag")
    private Set<Media> flagMedias = new HashSet<>();

    @OneToMany(mappedBy = "flag")
    private Set<UserMedia> flagUserMedias = new HashSet<>();

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

    public String getColor() {
        return color;
    }

    public void setColor(final String color) {
        this.color = color;
    }

    public Set<Media> getFlagMedias() {
        return flagMedias;
    }

    public void setFlagMedias(final Set<Media> flagMedias) {
        this.flagMedias = flagMedias;
    }

    public Set<UserMedia> getFlagUserMedias() {
        return flagUserMedias;
    }

    public void setFlagUserMedias(final Set<UserMedia> flagUserMedias) {
        this.flagUserMedias = flagUserMedias;
    }

}
