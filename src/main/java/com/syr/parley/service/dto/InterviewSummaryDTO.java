package com.syr.parley.service.dto;

import com.syr.parley.domain.Interview;
import java.util.ArrayList;

public class InterviewSummaryDTO {

    private Long interviewId;
    private String interviewDetails;
    private String jobName;
    private String candidateName;
    private ArrayList<String> usersNames;

    public InterviewSummaryDTO() {}

    public InterviewSummaryDTO(Interview interview) {
        interviewId = interview.getId();
        interviewDetails = interview.getDetails();
        interview.getJobs().stream().findFirst().ifPresent(jobEntity -> jobName = jobEntity.getJobName());
        candidateName = interview.getCandidate().getFirstName() + " " + interview.getCandidate().getLastName();
        interview.getUsers().forEach(users -> usersNames.add(users.getFirstName() + " " + users.getLastName()));
    }

    public Long getInterviewId() {
        return interviewId;
    }

    public void setInterviewId(Long interviewId) {
        this.interviewId = interviewId;
    }

    public String getInterviewDetails() {
        return interviewDetails;
    }

    public void setInterviewDetails(String interviewDetails) {
        this.interviewDetails = interviewDetails;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public ArrayList<String> getUsersNames() {
        return usersNames;
    }

    public void setUsersNames(ArrayList<String> usersNames) {
        this.usersNames = usersNames;
    }
}
