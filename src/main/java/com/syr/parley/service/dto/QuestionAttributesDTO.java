package com.syr.parley.service.dto;

import com.syr.parley.domain.Question;
import java.util.HashSet;
import java.util.Set;

public class QuestionAttributesDTO {

    private Long interviewId;
    private QuestionDTO question;
    private Set<AttributeDTO> attributes = new HashSet<>();

    public QuestionAttributesDTO() {}

    public QuestionAttributesDTO(Long interviewId, Question question) {
        this.interviewId = interviewId;
        this.question = new QuestionDTO(question.getId(), question.getQuestionName(), question.getQuestion());
        question
            .getAttributes()
            .forEach(attribute ->
                this.attributes.add(new AttributeDTO(attribute.getId(), attribute.getAttributeName(), attribute.getDescription()))
            );
    }

    public Long getInterviewId() {
        return interviewId;
    }

    public void setInterviewId(Long interviewId) {
        this.interviewId = interviewId;
    }

    public QuestionDTO getQuestion() {
        return question;
    }

    public void setQuestion(QuestionDTO question) {
        this.question = question;
    }

    public Set<AttributeDTO> getAttributes() {
        return attributes;
    }

    public void setAttributes(Set<AttributeDTO> attributes) {
        this.attributes = attributes;
    }
}
