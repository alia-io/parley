package com.syr.parley.service.dto;

public class QuestionDTO {

    private Long id;
    private String questionName;
    private String question;

    public QuestionDTO() {}

    public QuestionDTO(Long id, String questionName, String question) {
        this.id = id;
        this.questionName = questionName;
        this.question = question;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionName() {
        return questionName;
    }

    public void setQuestionName(String questionName) {
        this.questionName = questionName;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
