package com.mediatheque.mediatheque.model;

import jakarta.validation.constraints.NotNull;


public class UserMediaDTO {

    private Integer id;

    @NotNull
    private Integer user;

    @NotNull
    private Integer media;

    private Integer flag;

    public Integer getId() {
        return id;
    }

    public void setId(final Integer id) {
        this.id = id;
    }

    public Integer getUser() {
        return user;
    }

    public void setUser(final Integer user) {
        this.user = user;
    }

    public Integer getMedia() {
        return media;
    }

    public void setMedia(final Integer media) {
        this.media = media;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(final Integer flag) {
        this.flag = flag;
    }

}
