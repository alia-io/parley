package com.syr.parley.service;

import com.syr.parley.domain.Candidate;
import com.syr.parley.domain.Interview;
import com.syr.parley.domain.Job;
import com.syr.parley.domain.Users;
import com.syr.parley.repository.InterviewRepository;
import com.syr.parley.service.dto.InterviewDetailsDTO;
import com.syr.parley.service.dto.QuestionDTO;
import com.syr.parley.web.rest.InterviewController;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

@Service
@Transactional
public class InterviewService {

    private final Logger log = LoggerFactory.getLogger(InterviewController.class);

    private final InterviewRepository interviewRepository;

    @Autowired
    public InterviewService(InterviewRepository interviewRepository) {
        this.interviewRepository = interviewRepository;
    }

    public Interview createInterview(Interview interview) {
        return interviewRepository.save(interview);
    }

    public Optional<Interview> getInterviewById(Long id) {
        return interviewRepository.findById(id);
    }

    public Optional<Interview> getInterviewByIdWithRelationships(Long id) {
        return interviewRepository.findOneWithEagerRelationships(id);
    }

    public InterviewDetailsDTO getInterviewDetailsById(Long id) {
        InterviewDetailsDTO interviewDetailsDTO = new InterviewDetailsDTO();
        Interview interview = interviewRepository.findOneWithEagerRelationships(id).orElse(null);

        if (interview != null) {
            interviewDetailsDTO.setInterview(interview);
            interviewDetailsDTO.setCandidate(interview.getCandidate());
            interview.getJobs().stream().findFirst().ifPresent(interviewDetailsDTO::setJob);
            interviewDetailsDTO.setUserList(interview.getUsers());
            ArrayList<QuestionDTO> questionList = new ArrayList<>();
            interview.getQuestions().forEach(question -> questionList.add(new QuestionDTO(question, question.getAttributes())));
            interviewDetailsDTO.setQuestionList(questionList);
        }
        return interviewDetailsDTO;
    }

    /**
     * Partial updates given fields of an existing interview, field will ignore if it is null
     *
     * @param interview to update.
     * @return updated interview.
     */
    public Optional<Interview> updateInterview(Interview interview) {
        return interviewRepository
            .findById(interview.getId())
            .map(existingInterview -> {
                if (interview.getDetails() != null) {
                    existingInterview.setDetails(interview.getDetails());
                }

                return existingInterview;
            })
            .map(interviewRepository::save);
    }

    public List<Interview> getAllInterviews(@RequestParam(required = false) String filter) {
        if ("candidate-is-null".equals(filter)) {
            log.debug("REST request to get all Interviews where candidate is null");
            return StreamSupport
                .stream(interviewRepository.findAll().spliterator(), false)
                .filter(interview -> interview.getCandidate() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Interviews");
        return interviewRepository.findAllWithEagerRelationships();
    }

    public void deleteInterview(Long id) {
        interviewRepository.deleteById(id);
    }
}