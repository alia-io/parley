package com.syr.parley.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.syr.parley.domain.*;
import com.syr.parley.repository.*;
import com.syr.parley.service.dto.InterviewDetailsDTO;
import com.syr.parley.service.dto.NewInterviewDTO;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
@RunWith(MockitoJUnitRunner.class)
public class InterviewServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private JobRepository jobRepository = mock(JobRepository.class);

    @Mock
    private CandidateRepository candidateRepository;

    @Captor
    private ArgumentCaptor<Interview> interviewCaptor;

    @Captor
    private ArgumentCaptor<Users> usersCaptor;

    @Captor
    private ArgumentCaptor<Candidate> candidateCaptor;

    @InjectMocks
    private InterviewService interviewService;

    @Test
    public void createInterviewTest() throws URISyntaxException {
        Long userId1 = 2L;
        Long userId2 = 4L;
        String userFirstName1 = "First1";
        String userFirstName2 = "First2";
        String userLastName1 = "Last1";
        String userLastName2 = "Last2";
        Long interviewId = 6L;
        String interviewDetails = "Interview details";
        Long jobId = 7L;
        Long candidateId = 1L;
        String candidateFirstName = "Timmy";
        String candidateLastName = "Tester";
        String candidateEmail = "timmy@hotmail.com";

        ArrayList<Long> userList = new ArrayList<>();
        userList.add(userId1);
        userList.add(userId2);

        NewInterviewDTO newInterviewDTO = new NewInterviewDTO(
            userList,
            jobId,
            interviewDetails,
            candidateFirstName,
            candidateLastName,
            candidateEmail
        );

        Interview interview = new Interview();
        interview.setId(interviewId);
        interview.setDetails(interviewDetails);

        Job job = new Job();
        job.setId(jobId);

        Candidate candidate = new Candidate();
        candidate.setId(candidateId);
        candidate.setFirstName(candidateFirstName);
        candidate.setLastName(candidateLastName);
        candidate.setEmail(candidateEmail);

        User user1 = new User();
        User user2 = new User();
        user1.setId(userId1);
        user1.setFirstName(userFirstName1);
        user1.setLastName(userLastName1);
        user2.setId(userId2);
        user2.setFirstName(userFirstName2);
        user2.setLastName(userLastName2);

        when(interviewRepository.save(any(Interview.class))).thenReturn(interview);
        when(jobRepository.getById(jobId)).thenReturn(job);
        when(userRepository.getById(userId1)).thenReturn(user1);
        when(userRepository.getById(userId2)).thenReturn(user2);
        when(candidateRepository.save(any(Candidate.class))).thenReturn(candidate);

        ResponseEntity<InterviewDetailsDTO> interviewDetailsDTO = interviewService.createInterview(newInterviewDTO);

        verify(usersRepository, times(2)).save(usersCaptor.capture());
        List<Users> usersList = usersCaptor.getAllValues();
        assertThat(usersList.get(0).getFirstName()).isEqualTo(userFirstName1);
        assertThat(usersList.get(1).getFirstName()).isEqualTo(userFirstName2);

        verify(candidateRepository).save(candidateCaptor.capture());
        assertThat(candidateCaptor.getValue().getLastName()).isEqualTo(candidateLastName);

        verify(interviewRepository, times(2)).save(interviewCaptor.capture());
        assertThat(interviewCaptor.getValue().getUsers().size()).isEqualTo(usersList.size());

        assertThat(interviewDetailsDTO.getBody().getJob().getId()).isEqualTo(jobId);
    }
}
