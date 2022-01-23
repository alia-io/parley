package com.syr.parley.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * The Job entity.
 */
@Schema(description = "The Job entity.")
@Entity
@Table(name = "job")
public class Job implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "job_name")
    private String jobName;

    @Column(name = "job_description")
    private String jobDescription;

    @Column(name = "posted_date")
    private Instant postedDate;

    @Column(name = "job_role")
    private String jobRole;

    @Column(name = "minimum_qualifications")
    private String minimumQualifications;

    @Column(name = "responsibilities")
    private String responsibilities;

    @JsonIgnoreProperties(value = { "questions", "candidate", "job", "users" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Interview interview;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Job id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobName() {
        return this.jobName;
    }

    public Job jobName(String jobName) {
        this.setJobName(jobName);
        return this;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public String getJobDescription() {
        return this.jobDescription;
    }

    public Job jobDescription(String jobDescription) {
        this.setJobDescription(jobDescription);
        return this;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public Instant getPostedDate() {
        return this.postedDate;
    }

    public Job postedDate(Instant postedDate) {
        this.setPostedDate(postedDate);
        return this;
    }

    public void setPostedDate(Instant postedDate) {
        this.postedDate = postedDate;
    }

    public String getJobRole() {
        return this.jobRole;
    }

    public Job jobRole(String jobRole) {
        this.setJobRole(jobRole);
        return this;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getMinimumQualifications() {
        return this.minimumQualifications;
    }

    public Job minimumQualifications(String minimumQualifications) {
        this.setMinimumQualifications(minimumQualifications);
        return this;
    }

    public void setMinimumQualifications(String minimumQualifications) {
        this.minimumQualifications = minimumQualifications;
    }

    public String getResponsibilities() {
        return this.responsibilities;
    }

    public Job responsibilities(String responsibilities) {
        this.setResponsibilities(responsibilities);
        return this;
    }

    public void setResponsibilities(String responsibilities) {
        this.responsibilities = responsibilities;
    }

    public Interview getInterview() {
        return this.interview;
    }

    public void setInterview(Interview interview) {
        this.interview = interview;
    }

    public Job interview(Interview interview) {
        this.setInterview(interview);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Job)) {
            return false;
        }
        return id != null && id.equals(((Job) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Job{" +
            "id=" + getId() +
            ", jobName='" + getJobName() + "'" +
            ", jobDescription='" + getJobDescription() + "'" +
            ", postedDate='" + getPostedDate() + "'" +
            ", jobRole='" + getJobRole() + "'" +
            ", minimumQualifications='" + getMinimumQualifications() + "'" +
            ", responsibilities='" + getResponsibilities() + "'" +
            "}";
    }
}
