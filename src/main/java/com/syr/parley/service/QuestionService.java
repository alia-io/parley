package com.syr.parley.service;

import com.syr.parley.domain.Attribute;
import com.syr.parley.domain.Interview;
import com.syr.parley.domain.Question;
import com.syr.parley.repository.AttributeRepository;
import com.syr.parley.repository.InterviewRepository;
import com.syr.parley.repository.QuestionRepository;
import com.syr.parley.service.dto.AttributeDTO;
import com.syr.parley.service.dto.NewQuestionDTO;
import com.syr.parley.service.dto.QuestionAttributesDTO;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final InterviewRepository interviewRepository;
    private final AttributeRepository attributeRepository;

    @Autowired
    public QuestionService(
        QuestionRepository questionRepository,
        InterviewRepository interviewRepository,
        AttributeRepository attributeRepository
    ) {
        this.questionRepository = questionRepository;
        this.interviewRepository = interviewRepository;
        this.attributeRepository = attributeRepository;
    }

    public QuestionAttributesDTO createQuestion(Long interviewId, NewQuestionDTO newQuestionDTO) {
        Interview interview = interviewRepository.findById(interviewId).orElse(null);
        assert interview != null;
        Question question = new Question();
        question.setQuestionName(newQuestionDTO.getQuestionName());
        question = questionRepository.save(question);
        if (newQuestionDTO.getQuestion() != null && newQuestionDTO.getQuestion().length() > 0) question.setQuestion(
            newQuestionDTO.getQuestion()
        );
        if (question.getAttributes() != null) {
            for (AttributeDTO attributeDTO : newQuestionDTO.getAttributes()) {
                Attribute attribute = attributeRepository.findById(attributeDTO.getId()).orElse(null);
                if (attribute != null) question.addAttributes(attribute);
            }
        }
        interview.addQuestions(question);
        question = questionRepository.save(question);
        return new QuestionAttributesDTO(interviewId, question);
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    public Optional<Question> getQuestionByIdWithRelationships(Long id) {
        return questionRepository.findOneWithEagerRelationships(id);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAllWithEagerRelationships();
    }

    public Optional<Question> updateQuestion(Question question) {
        return questionRepository
            .findById(question.getId())
            .map(existingQuestion -> {
                if (question.getQuestionName() != null) {
                    existingQuestion.setQuestionName(question.getQuestionName());
                }
                if (question.getQuestion() != null) {
                    existingQuestion.setQuestion(question.getQuestion());
                }

                return existingQuestion;
            })
            .map(questionRepository::save);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    // Send Question and Attributes by interview
    public List<QuestionAttributesDTO> getQuestionsByInterview(Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId).orElse(null);
        assert interview != null;
        return interview
            .getQuestions()
            .stream()
            .map(question -> new QuestionAttributesDTO(interviewId, question))
            .collect(Collectors.toList());
    }
}
