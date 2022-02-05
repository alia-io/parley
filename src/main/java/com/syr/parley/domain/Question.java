package com.syr.parley.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * The Question entity.
 */
@Schema(description = "The Question entity.")
@Entity
@Table(name = "question")
public class Question implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "question_name")
    private String questionName;

    @Column(name = "question")
    private String question;

    @ManyToMany
    @JoinTable(
        name = "rel_question__attributes",
        joinColumns = @JoinColumn(name = "question_id"),
        inverseJoinColumns = @JoinColumn(name = "attributes_id")
    )
    @JsonIgnoreProperties(value = { "questions" }, allowSetters = true)
    private Set<Attribute> attributes = new HashSet<>();

    @ManyToMany(mappedBy = "questions")
    @JsonIgnoreProperties(value = { "questions", "candidate", "users", "jobs" }, allowSetters = true)
    private Set<Interview> interviews = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Question id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionName() {
        return this.questionName;
    }

    public Question questionName(String questionName) {
        this.setQuestionName(questionName);
        return this;
    }

    public void setQuestionName(String questionName) {
        this.questionName = questionName;
    }

    public String getQuestion() {
        return this.question;
    }

    public Question question(String question) {
        this.setQuestion(question);
        return this;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Set<Attribute> getAttributes() {
        return this.attributes;
    }

    public void setAttributes(Set<Attribute> attributes) {
        this.attributes = attributes;
    }

    public Question attributes(Set<Attribute> attributes) {
        this.setAttributes(attributes);
        return this;
    }

    public Question addAttributes(Attribute attribute) {
        this.attributes.add(attribute);
        attribute.getQuestions().add(this);
        return this;
    }

    public Question removeAttributes(Attribute attribute) {
        this.attributes.remove(attribute);
        attribute.getQuestions().remove(this);
        return this;
    }

    public Set<Interview> getInterviews() {
        return this.interviews;
    }

    public void setInterviews(Set<Interview> interviews) {
        if (this.interviews != null) {
            this.interviews.forEach(i -> i.removeQuestions(this));
        }
        if (interviews != null) {
            interviews.forEach(i -> i.addQuestions(this));
        }
        this.interviews = interviews;
    }

    public Question interviews(Set<Interview> interviews) {
        this.setInterviews(interviews);
        return this;
    }

    public Question addInterview(Interview interview) {
        this.interviews.add(interview);
        interview.getQuestions().add(this);
        return this;
    }

    public Question removeInterview(Interview interview) {
        this.interviews.remove(interview);
        interview.getQuestions().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Question)) {
            return false;
        }
        return id != null && id.equals(((Question) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Question{" +
            "id=" + getId() +
            ", questionName='" + getQuestionName() + "'" +
            ", question='" + getQuestion() + "'" +
            "}";
    }
}
