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
