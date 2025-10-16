package com.mediatheque.mediatheque.events;


public class BeforeDeleteMediaType {

    private Integer id;

    public BeforeDeleteMediaType(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

}
