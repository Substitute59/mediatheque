package com.mediatheque.mediatheque.model;

import com.mediatheque.mediatheque.domain.Collection;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class CollectionDTO {

    private Integer id;

    @NotNull
    @Size(max = 200)
    private String name;

    public CollectionDTO() {}

    public CollectionDTO(Collection collection) {
        this.id = collection.getId();
        this.name = collection.getName();
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

}
