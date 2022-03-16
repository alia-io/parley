package com.syr.parley.service.dto;

import com.syr.parley.domain.Question;
import java.util.ArrayList;

public class QuestionAttributesDTO {

    private QuestionDTO question;
    private ArrayList<AttributeDTO> attributes = new ArrayList<>();

    public QuestionAttributesDTO() {}

    public QuestionAttributesDTO(Question question) {
        this.question = new QuestionDTO(question.getId(), question.getQuestionName(), question.getQuestion());
        if (question.getAttributes() != null) question
            .getAttributes()
            .forEach(attribute ->
                attributes.add(new AttributeDTO(attribute.getId(), attribute.getAttributeName(), attribute.getDescription()))
            );
    }

    public QuestionDTO getQuestion() {
        return question;
    }

    public void setQuestion(QuestionDTO question) {
        this.question = question;
    }

    public ArrayList<AttributeDTO> getAttributes() {
        return attributes;
    }

    public void setAttributes(ArrayList<AttributeDTO> attributes) {
        this.attributes = attributes;
    }
}
