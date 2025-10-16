package com.mediatheque.mediatheque.events;


public class BeforeDeleteCollection {

    private Integer id;

    public BeforeDeleteCollection(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

}
