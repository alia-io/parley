package com.syr.parley.service;

import com.syr.parley.domain.*;
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
                users.setUser(user);
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
        return new InterviewDetailsDTO(interview);
    }

    public Optional<Interview> getInterviewById(Long id) {
        return interviewRepository.findById(id);
    }

    public Optional<Interview> getInterviewByIdWithRelationships(Long id) {
        return interviewRepository.findOneWithEagerRelationships(id);
    }

    public InterviewDetailsDTO getInterviewDetailsById(Long id) {
        return new InterviewDetailsDTO(Objects.requireNonNull(interviewRepository.findOneWithEagerRelationships(id).orElse(null)));
    }

    public List<UsersDTO> getAllUsersByInterviewId(Long id) {
        Interview interview = interviewRepository.findOneWithEagerRelationships(id).orElse(null);
        assert interview != null;
        ArrayList<UsersDTO> usersList = new ArrayList<>();
        for (Users users : interview.getUsers()) {
            usersList.add(new UsersDTO(users.getId(), users.getFirstName(), users.getLastName()));
        }
        return usersList;
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

    public List<InterviewSummaryDTO> getAllInterviewSummaries() {
        List<InterviewSummaryDTO> interviewSummaryList = new ArrayList<>();
        interviewRepository
            .findAllWithEagerRelationships()
            .forEach(interview -> interviewSummaryList.add(new InterviewSummaryDTO(interview)));
        return interviewSummaryList;
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
        Interview interview = interviewRepository.findOneWithEagerRelationships(id).orElse(null);
        assert interview != null;
        if (interview.getCandidate() != null) candidateRepository.delete(interview.getCandidate());
        interview.getJobs().forEach(jobRepository::delete);
        interview.getUsers().forEach(usersRepository::delete);
        interviewRepository.delete(interview);
    }
}
