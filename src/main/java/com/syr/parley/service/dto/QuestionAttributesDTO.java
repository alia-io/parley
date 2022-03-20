package com.syr.parley.service.dto;

import java.util.List;
import lombok.*;

@Data
public class QuestionAttributesDTO {

    private String questionName;
    private String question;
    private List<AttributeDTO> attributes;

    public QuestionAttributesDTO() {}

    public QuestionAttributesDTO(String questionName, String question, List<AttributeDTO> attributes) {
        this.questionName = questionName;
        this.question = question;
        this.attributes = attributes;
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

    public List<AttributeDTO> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<AttributeDTO> attributes) {
        this.attributes = attributes;
    }
}
