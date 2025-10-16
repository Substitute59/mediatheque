package com.mediatheque.mediatheque.events;


public class BeforeDeleteArtist {

    private Integer id;

    public BeforeDeleteArtist(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

}
