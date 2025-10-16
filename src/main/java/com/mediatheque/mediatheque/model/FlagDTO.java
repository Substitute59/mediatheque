package com.mediatheque.mediatheque.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class FlagDTO {

    private Integer id;

    @NotNull
    @Size(max = 100)
    private String name;

    @Size(max = 50)
    private String color;

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

}
