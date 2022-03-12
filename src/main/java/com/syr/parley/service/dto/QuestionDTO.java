package com.syr.parley.service.dto;

import com.syr.parley.domain.Attribute;
import com.syr.parley.domain.Question;
import java.util.ArrayList;

public class QuestionDTO {

    private Question question;
    private ArrayList<Attribute> attributes;

    public QuestionDTO() {}

    public QuestionDTO(Question question, ArrayList<Attribute> attributes) {
        this.question = question;
        this.attributes = attributes;
    }
}
