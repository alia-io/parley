package com.syr.parley.service;

import com.syr.parley.domain.*;
import com.syr.parley.repository.*;
import com.syr.parley.service.dto.InterviewDetailsDTO;
import com.syr.parley.service.dto.NewInterviewDTO;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import javax.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import tech.jhipster.web.util.HeaderUtil;

@Service
@Transactional
public class InterviewService {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private static final String ENTITY_NAME = "interview";

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

    public ResponseEntity<InterviewDetailsDTO> createInterview(NewInterviewDTO newInterviewDTO) throws URISyntaxException {
        Interview interview = new Interview();
        interview.setDetails(newInterviewDTO.getInterviewDetails());
        interview = interviewRepository.save(interview);

        Job job = jobRepository.getById(newInterviewDTO.getJobId());
        interview.addJob(job);

        ArrayList<Users> usersList = new ArrayList<>();
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

        Candidate candidate = new Candidate();
        candidate.setFirstName(newInterviewDTO.getCandidateFirstName());
        candidate.setLastName(newInterviewDTO.getCandidateLastName());
        candidate.setEmail(newInterviewDTO.getCandidateEmail());
        candidate.setInterview(interview);
        candidate = candidateRepository.save(candidate);
        interview.setCandidate(candidate);

        interview = interviewRepository.save(interview);
        InterviewDetailsDTO interviewDetailsDTO = new InterviewDetailsDTO(interview, candidate, job, usersList, null);
        return ResponseEntity
            .created(new URI("/api/interviews/" + interview.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, interview.getId().toString()))
            .body(interviewDetailsDTO);
    }
}
