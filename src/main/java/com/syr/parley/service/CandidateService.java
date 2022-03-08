package com.syr.parley.service;

import com.syr.parley.domain.Candidate;
import com.syr.parley.repository.CandidateRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CandidateService {

    private final CandidateRepository candidateRepository;

    @Autowired
    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    public Candidate createCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    public Optional<Candidate> getCandidateById(Long id) {
        return candidateRepository.findById(id);
    }

    /**
     * Partial updates given fields of an existing candidate, field will ignore if it is null
     *
     * @param candidate to update.
     * @return updated candidate.
     */
    public Optional<Candidate> updateCandidate(Candidate candidate) {
        return candidateRepository
            .findById(candidate.getId())
            .map(existingCandidate -> {
                if (candidate.getFirstName() != null) {
                    existingCandidate.setFirstName(candidate.getFirstName());
                }
                if (candidate.getLastName() != null) {
                    existingCandidate.setLastName(candidate.getLastName());
                }
                if (candidate.getEmail() != null) {
                    existingCandidate.setEmail(candidate.getEmail());
                }

                return existingCandidate;
            })
            .map(candidateRepository::save);
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public void deleteCandidate(Long id) {
        candidateRepository.deleteById(id);
    }
}
