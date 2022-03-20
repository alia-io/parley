package com.syr.parley.service.dto;

import com.syr.parley.domain.User;
import java.util.HashSet;
import java.util.Set;

public class UsersDisplayDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private Set<Long> interviewIds = new HashSet<>();

    public UsersDisplayDTO() {}

    public UsersDisplayDTO(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        user
            .getUsers()
            .forEach(users -> users.getInterviews().stream().findFirst().ifPresent(interview -> this.interviewIds.add(interview.getId())));
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

    public Set<Long> getInterviewIds() {
        return interviewIds;
    }

    public void setInterviewIds(Set<Long> interviewIds) {
        this.interviewIds = interviewIds;
    }

    public void addInterviewId(Long interviewId) {
        this.interviewIds.add(interviewId);
    }
}
