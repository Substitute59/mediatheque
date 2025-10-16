package com.mediatheque.mediatheque.events;


public class BeforeDeletePlatform {

    private Integer id;

    public BeforeDeletePlatform(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

}
