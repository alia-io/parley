package com.syr.parley.service.dto;

import com.syr.parley.domain.Attribute;
import com.syr.parley.domain.Question;
import java.util.Set;

public class QuestionDTO {

    private Question question;
    private Set<Attribute> attributes;

    public QuestionDTO() {}

    public QuestionDTO(Question question, Set<Attribute> attributes) {
        this.question = question;
        this.attributes = attributes;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Set<Attribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(Set<Attribute> attributes) {
        this.attributes = attributes;
    }
}
