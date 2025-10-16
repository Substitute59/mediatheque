package com.mediatheque.mediatheque.events;


public class BeforeDeleteMedia {

    private Integer id;

    public BeforeDeleteMedia(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

}
