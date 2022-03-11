package com.syr.parley.service.dto;

import com.syr.parley.domain.Candidate;
import com.syr.parley.domain.Interview;
import com.syr.parley.domain.Job;
import com.syr.parley.domain.Users;
import java.util.ArrayList;

public class InterviewDetailsDTO {

    private Interview interview;
    private Candidate candidate;
    private Job job;
    private ArrayList<Users> userList;
    private ArrayList<QuestionDTO> questionList;

    public InterviewDetailsDTO() {}

    public InterviewDetailsDTO(
        Interview interview,
        Candidate candidate,
        Job job,
        ArrayList<Users> userList,
        ArrayList<QuestionDTO> questionList
    ) {
        this.interview = interview;
        this.candidate = candidate;
        this.job = job;
        this.userList = userList;
        this.questionList = questionList;
    }

    public void setInterview(Interview interview) {
        this.interview = interview;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public void setUserList(ArrayList<Users> userList) {
        this.userList = userList;
    }

    public void setQuestionList(ArrayList<QuestionDTO> questionList) {
        this.questionList = questionList;
    }

    public Interview getInterview() {
        return interview;
    }

    public Candidate getCandidate() {
        return candidate;
    }

    public Job getJob() {
        return job;
    }

    public ArrayList<Users> getUserList() {
        return userList;
    }

    public ArrayList<QuestionDTO> getQuestionList() {
        return questionList;
    }
}
