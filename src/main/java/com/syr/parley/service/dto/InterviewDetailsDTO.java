package com.syr.parley.service.dto;

import com.syr.parley.domain.*;
import java.util.ArrayList;

public class InterviewDetailsDTO {

    private InterviewDTO interview;
    private CandidateDTO candidate;
    private JobDTO job;
    private ArrayList<UsersDTO> usersList = new ArrayList<>();
    private ArrayList<QuestionAttributesDTO> questionList = new ArrayList<>();

    public InterviewDetailsDTO() {}

    public InterviewDetailsDTO(Interview interview) {
        this.interview = new InterviewDTO(interview.getId(), interview.getDetails());

        if (interview.getCandidate() != null) {
            this.candidate =
                new CandidateDTO(
                    interview.getCandidate().getId(),
                    interview.getCandidate().getFirstName(),
                    interview.getCandidate().getLastName(),
                    interview.getCandidate().getEmail()
                );
        }

        interview
            .getJobs()
            .stream()
            .findFirst()
            .ifPresent(jobEntity ->
                this.job =
                    new JobDTO(
                        jobEntity.getId(),
                        jobEntity.getJobName(),
                        jobEntity.getJobDescription(),
                        jobEntity.getPostedDate(),
                        jobEntity.getJobRole(),
                        jobEntity.getMinimumQualifications(),
                        jobEntity.getResponsibilities()
                    )
            );

        interview.getUsers().forEach(users -> this.usersList.add(new UsersDTO(users.getId(), users.getFirstName(), users.getLastName())));
    }

    public InterviewDTO getInterview() {
        return interview;
    }

    public void setInterview(InterviewDTO interview) {
        this.interview = interview;
    }

    public CandidateDTO getCandidate() {
        return candidate;
    }

    public void setCandidate(CandidateDTO candidate) {
        this.candidate = candidate;
    }

    public JobDTO getJob() {
        return job;
    }

    public void setJob(JobDTO job) {
        this.job = job;
    }

    public ArrayList<UsersDTO> getUsersList() {
        return usersList;
    }

    public void setUsersList(ArrayList<UsersDTO> usersList) {
        this.usersList = usersList;
    }

    public ArrayList<QuestionAttributesDTO> getQuestionList() {
        return questionList;
    }

    public void setQuestionList(ArrayList<QuestionAttributesDTO> questionList) {
        this.questionList = questionList;
    }
}
