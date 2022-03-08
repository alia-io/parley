package com.syr.parley.service;

import com.syr.parley.domain.Question;
import com.syr.parley.repository.QuestionRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class QuestionService {

    private final QuestionRepository questionRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public Question createQuestion(Question question) {
        return questionRepository.save(question);
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
}
