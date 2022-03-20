package com.syr.parley.service;

import com.syr.parley.domain.Attribute;
import com.syr.parley.domain.Interview;
import com.syr.parley.domain.Question;
import com.syr.parley.repository.AttributeRepository;
import com.syr.parley.repository.InterviewRepository;
import com.syr.parley.repository.QuestionRepository;
import com.syr.parley.service.dto.AttributeDTO;
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

    public QuestionAttributesDTO createQuestion(Long interviewId, QuestionAttributesDTO questionAttributesDTO) {
        Interview interview = interviewRepository.findById(interviewId).orElse(null);

        Question question = new Question();
        question.setQuestionName(questionAttributesDTO.getQuestionName());
        question.setQuestion(question.getQuestion());

        Set<Attribute> attributeSet = new HashSet<>();
        questionAttributesDTO.getAttributes().forEach(attribute -> attributeSet.add(attributeRepository.findById(attribute.getId()).get()));

        question.setAttributes(attributeSet);
        assert interview != null;
        question.setInterviews(Set.of(interview));

        questionRepository.save(question);

        return questionAttributesDTO;
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
            .map(question -> {
                List<AttributeDTO> attributeDTOS = question
                    .getAttributes()
                    .stream()
                    .map(attribute -> new AttributeDTO(attribute.getId(), attribute.getAttributeName(), attribute.getDescription()))
                    .collect(Collectors.toList());

                return new QuestionAttributesDTO(question.getQuestion(), question.getQuestionName(), attributeDTOS);
            })
            .collect(Collectors.toList());
    }
}
