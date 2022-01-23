package com.syr.parley.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * The Interview entity.
 */
@Schema(description = "The Interview entity.")
@Entity
@Table(name = "interview")
public class Interview implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "details")
    private String details;

    @OneToMany(mappedBy = "interview")
    @JsonIgnoreProperties(value = { "attributes", "interview" }, allowSetters = true)
    private Set<Question> questions = new HashSet<>();

    @JsonIgnoreProperties(value = { "interview" }, allowSetters = true)
    @OneToOne(mappedBy = "interview")
    private Candidate candidate;

    @JsonIgnoreProperties(value = { "interview" }, allowSetters = true)
    @OneToOne(mappedBy = "interview")
    private Job job;

    @ManyToMany(mappedBy = "interviews")
    @JsonIgnoreProperties(value = { "interviews" }, allowSetters = true)
    private Set<Users> users = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Interview id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDetails() {
        return this.details;
    }

    public Interview details(String details) {
        this.setDetails(details);
        return this;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Set<Question> getQuestions() {
        return this.questions;
    }

    public void setQuestions(Set<Question> questions) {
        if (this.questions != null) {
            this.questions.forEach(i -> i.setInterview(null));
        }
        if (questions != null) {
            questions.forEach(i -> i.setInterview(this));
        }
        this.questions = questions;
    }

    public Interview questions(Set<Question> questions) {
        this.setQuestions(questions);
        return this;
    }

    public Interview addQuestions(Question question) {
        this.questions.add(question);
        question.setInterview(this);
        return this;
    }

    public Interview removeQuestions(Question question) {
        this.questions.remove(question);
        question.setInterview(null);
        return this;
    }

    public Candidate getCandidate() {
        return this.candidate;
    }

    public void setCandidate(Candidate candidate) {
        if (this.candidate != null) {
            this.candidate.setInterview(null);
        }
        if (candidate != null) {
            candidate.setInterview(this);
        }
        this.candidate = candidate;
    }

    public Interview candidate(Candidate candidate) {
        this.setCandidate(candidate);
        return this;
    }

    public Job getJob() {
        return this.job;
    }

    public void setJob(Job job) {
        if (this.job != null) {
            this.job.setInterview(null);
        }
        if (job != null) {
            job.setInterview(this);
        }
        this.job = job;
    }

    public Interview job(Job job) {
        this.setJob(job);
        return this;
    }

    public Set<Users> getUsers() {
        return this.users;
    }

    public void setUsers(Set<Users> users) {
        if (this.users != null) {
            this.users.forEach(i -> i.removeInterview(this));
        }
        if (users != null) {
            users.forEach(i -> i.addInterview(this));
        }
        this.users = users;
    }

    public Interview users(Set<Users> users) {
        this.setUsers(users);
        return this;
    }

    public Interview addUsers(Users users) {
        this.users.add(users);
        users.getInterviews().add(this);
        return this;
    }

    public Interview removeUsers(Users users) {
        this.users.remove(users);
        users.getInterviews().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Interview)) {
            return false;
        }
        return id != null && id.equals(((Interview) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Interview{" +
            "id=" + getId() +
            ", details='" + getDetails() + "'" +
            "}";
    }
}
