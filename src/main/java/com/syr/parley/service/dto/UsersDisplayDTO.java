package com.syr.parley.service.dto;

import com.syr.parley.domain.User;

public class UsersDisplayDTO {

    private Long id;
    private String firstName;
    private String lastName;

    public UsersDisplayDTO() {}

    public UsersDisplayDTO(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
