package com.syr.parley.service.dto;

import java.util.HashSet;
import java.util.Set;

public class NewQuestionDTO {

    private String questionName;
    private String question;
    private Set<AttributeDTO> attributes = new HashSet<>();

    public NewQuestionDTO() {}

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

    public Set<AttributeDTO> getAttributes() {
        return attributes;
    }

    public void setAttributes(Set<AttributeDTO> attributes) {
        this.attributes = attributes;
    }
}
