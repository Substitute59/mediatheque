package com.mediatheque.mediatheque.events;


public class BeforeDeleteGenre {

    private Integer id;

    public BeforeDeleteGenre(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

}
