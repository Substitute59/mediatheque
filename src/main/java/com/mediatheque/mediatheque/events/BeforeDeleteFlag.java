package com.mediatheque.mediatheque.events;


public class BeforeDeleteFlag {

    private Integer id;

    public BeforeDeleteFlag(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

}
