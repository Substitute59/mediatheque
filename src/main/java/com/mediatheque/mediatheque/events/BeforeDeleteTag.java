package com.mediatheque.mediatheque.events;


public class BeforeDeleteTag {

    private Integer id;

    public BeforeDeleteTag(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

}
