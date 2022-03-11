package com.syr.parley.service;

import com.syr.parley.domain.*;
import com.syr.parley.domain.Candidate;
import com.syr.parley.domain.Interview;
import com.syr.parley.domain.Job;
import com.syr.parley.domain.Users;
import com.syr.parley.repository.*;
import com.syr.parley.service.dto.*;
import com.syr.parley.web.rest.InterviewController;
import java.util.*;
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

    private final UserRepository userRepository;
    private final UsersRepository usersRepository;
    private final InterviewRepository interviewRepository;
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final QuestionRepository questionRepository;
    private final AttributeRepository attributeRepository;

    @Autowired
    public InterviewService(
        UserRepository userRepository,
        UsersRepository usersRepository,
        InterviewRepository interviewRepository,
        JobRepository jobRepository,
        CandidateRepository candidateRepository,
        QuestionRepository questionRepository,
        AttributeRepository attributeRepository
    ) {
        this.userRepository = userRepository;
        this.usersRepository = usersRepository;
        this.interviewRepository = interviewRepository;
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
        this.questionRepository = questionRepository;
        this.attributeRepository = attributeRepository;
    }

    public Interview createInterview(Interview interview) {
        return interviewRepository.save(interview);
    }

    public InterviewDetailsDTO createInterviewWithRelationships(NewInterviewDTO newInterviewDTO) {
        // create the new interview
        Interview interview = new Interview();
        interview.setDetails(newInterviewDTO.getInterviewDetails());
        interview = interviewRepository.save(interview);

        // set the job for the interview
        Job job = jobRepository.getById(newInterviewDTO.getJobId());
        interview.addJob(job);

        // create and set the list of users (interviewers) for the interview
        Set<Users> usersList = new HashSet<>();
        if (newInterviewDTO.getUserIdList() != null) {
            for (Long userId : newInterviewDTO.getUserIdList()) {
                User user = userRepository.getById(userId);
                Users users = new Users();
                users.setFirstName(user.getFirstName());
                users.setLastName(user.getLastName());
                users.addInterview(interview);
                usersList.add(usersRepository.save(users));
            }
        }

        // set the candidate for the interview
        Candidate candidate = new Candidate();
        candidate.setFirstName(newInterviewDTO.getCandidateFirstName());
        candidate.setLastName(newInterviewDTO.getCandidateLastName());
        candidate.setEmail(newInterviewDTO.getCandidateEmail());
        candidate.setInterview(interview);
        candidate = candidateRepository.save(candidate);
        interview.setCandidate(candidate);

        // save and send back interview details
        interview = interviewRepository.save(interview);
        return new InterviewDetailsDTO(interview, candidate, job, usersList, null);
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

    public List<UserDisplayDTO> getAllUser() {
        return userRepository.findAll().stream().map(UserDisplayDTO::new).collect(Collectors.toList());
    }
}
