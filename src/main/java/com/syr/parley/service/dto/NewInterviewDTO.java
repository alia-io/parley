package com.syr.parley.service.dto;

import java.util.ArrayList;

public class NewInterviewDTO {

    private ArrayList<Long> userIdList;
    private Long jobId;
    private String interviewDetails;
    private String candidateFirstName;
    private String candidateLastName;
    private String candidateEmail;

    public NewInterviewDTO() {
        // Empty constructor needed for Jackson.
    }

    public NewInterviewDTO(
        ArrayList<Long> userIdList,
        Long jobId,
        String interviewDetails,
        String candidateFirstName,
        String candidateLastName,
        String candidateEmail
    ) {
        this.userIdList = userIdList;
        this.jobId = jobId;
        this.interviewDetails = interviewDetails;
        this.candidateFirstName = candidateFirstName;
        this.candidateLastName = candidateLastName;
        this.candidateEmail = candidateEmail;
    }

    public ArrayList<Long> getUserIdList() {
        return userIdList;
    }

    public Long getJobId() {
        return jobId;
    }

    public String getInterviewDetails() {
        return interviewDetails;
    }

    public String getCandidateFirstName() {
        return candidateFirstName;
    }

    public String getCandidateLastName() {
        return candidateLastName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }
}
