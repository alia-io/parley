package com.syr.parley.service;

import com.syr.parley.domain.Job;
import com.syr.parley.repository.JobRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class JobService {

    private final JobRepository jobRepository;

    @Autowired
    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public Optional<Job> getJobByIdWithRelationships(Long id) {
        return jobRepository.findOneWithEagerRelationships(id);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAllWithEagerRelationships();
    }

    public Optional<Job> updateJob(Job job) {
        return jobRepository
            .findById(job.getId())
            .map(existingJob -> {
                if (job.getJobName() != null) {
                    existingJob.setJobName(job.getJobName());
                }
                if (job.getJobDescription() != null) {
                    existingJob.setJobDescription(job.getJobDescription());
                }
                if (job.getPostedDate() != null) {
                    existingJob.setPostedDate(job.getPostedDate());
                }
                if (job.getJobRole() != null) {
                    existingJob.setJobRole(job.getJobRole());
                }
                if (job.getMinimumQualifications() != null) {
                    existingJob.setMinimumQualifications(job.getMinimumQualifications());
                }
                if (job.getResponsibilities() != null) {
                    existingJob.setResponsibilities(job.getResponsibilities());
                }

                return existingJob;
            })
            .map(jobRepository::save);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
