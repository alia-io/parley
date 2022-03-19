package com.syr.parley.service.dto;

import java.time.Instant;

public class JobDTO {

    private Long id;
    private String jobName;
    private String jobDescription;
    private Instant postedDate;
    private String jobRole;
    private String minimumQualifications;
    private String responsibilities;

    public JobDTO() {}

    public JobDTO(
        Long id,
        String jobName,
        String jobDescription,
        Instant postedDate,
        String jobRole,
        String minimumQualifications,
        String responsibilities
    ) {
        this.id = id;
        this.jobName = jobName;
        this.jobDescription = jobDescription;
        this.postedDate = postedDate;
        this.jobRole = jobRole;
        this.minimumQualifications = minimumQualifications;
        this.responsibilities = responsibilities;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public Instant getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(Instant postedDate) {
        this.postedDate = postedDate;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getMinimumQualifications() {
        return minimumQualifications;
    }

    public void setMinimumQualifications(String minimumQualifications) {
        this.minimumQualifications = minimumQualifications;
    }

    public String getResponsibilities() {
        return responsibilities;
    }

    public void setResponsibilities(String responsibilities) {
        this.responsibilities = responsibilities;
    }
}
