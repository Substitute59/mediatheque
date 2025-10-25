package com.mediatheque.mediatheque.model;

import com.mediatheque.mediatheque.domain.Platform;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class PlatformDTO {

    private Integer id;

    @NotNull
    @Size(max = 100)
    private String name;

    public PlatformDTO() {}

    public PlatformDTO(Platform platform) {
        this.id = platform.getId();
        this.name = platform.getName();
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
