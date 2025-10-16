package com.mediatheque.mediatheque.events;


public class BeforeDeleteUser {

    private Integer id;

    public BeforeDeleteUser(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

}
