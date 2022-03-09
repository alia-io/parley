package com.syr.parley.service.dto;

import com.syr.parley.domain.User;

public class UserDisplayDTO {

    private Long id;
    private String name;

    public UserDisplayDTO() {}

    public UserDisplayDTO(User user) {
        this.id = user.getId();
        this.name = user.getFirstName() + " " + user.getLastName();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
