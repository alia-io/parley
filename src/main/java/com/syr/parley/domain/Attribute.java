package com.syr.parley.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import javax.persistence.*;

/**
 * The Attribute entity.
 */
@Schema(description = "The Attribute entity.")
@Entity
@Table(name = "attribute")
public class Attribute implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "attribute_name")
    private String attributeName;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JsonIgnoreProperties(value = { "attributes", "interview" }, allowSetters = true)
    private Question questions;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Attribute id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAttributeName() {
        return this.attributeName;
    }

    public Attribute attributeName(String attributeName) {
        this.setAttributeName(attributeName);
        return this;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public String getDescription() {
        return this.description;
    }

    public Attribute description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Question getQuestions() {
        return this.questions;
    }

    public void setQuestions(Question question) {
        this.questions = question;
    }

    public Attribute questions(Question question) {
        this.setQuestions(question);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Attribute)) {
            return false;
        }
        return id != null && id.equals(((Attribute) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Attribute{" +
            "id=" + getId() +
            ", attributeName='" + getAttributeName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
