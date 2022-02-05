package com.syr.parley.web.rest;

import com.syr.parley.domain.Interview;
import com.syr.parley.repository.InterviewRepository;
import com.syr.parley.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.syr.parley.domain.Interview}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InterviewResource {

    private final Logger log = LoggerFactory.getLogger(InterviewResource.class);

    private static final String ENTITY_NAME = "interview";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InterviewRepository interviewRepository;

    public InterviewResource(InterviewRepository interviewRepository) {
        this.interviewRepository = interviewRepository;
    }

    /**
     * {@code POST  /interviews} : Create a new interview.
     *
     * @param interview the interview to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new interview, or with status {@code 400 (Bad Request)} if the interview has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/interviews")
    public ResponseEntity<Interview> createInterview(@RequestBody Interview interview) throws URISyntaxException {
        log.debug("REST request to save Interview : {}", interview);
        if (interview.getId() != null) {
            throw new BadRequestAlertException("A new interview cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Interview result = interviewRepository.save(interview);
        return ResponseEntity
            .created(new URI("/api/interviews/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /interviews/:id} : Updates an existing interview.
     *
     * @param id the id of the interview to save.
     * @param interview the interview to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated interview,
     * or with status {@code 400 (Bad Request)} if the interview is not valid,
     * or with status {@code 500 (Internal Server Error)} if the interview couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/interviews/{id}")
    public ResponseEntity<Interview> updateInterview(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Interview interview
    ) throws URISyntaxException {
        log.debug("REST request to update Interview : {}, {}", id, interview);
        if (interview.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, interview.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!interviewRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Interview result = interviewRepository.save(interview);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, interview.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /interviews/:id} : Partial updates given fields of an existing interview, field will ignore if it is null
     *
     * @param id the id of the interview to save.
     * @param interview the interview to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated interview,
     * or with status {@code 400 (Bad Request)} if the interview is not valid,
     * or with status {@code 404 (Not Found)} if the interview is not found,
     * or with status {@code 500 (Internal Server Error)} if the interview couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/interviews/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Interview> partialUpdateInterview(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Interview interview
    ) throws URISyntaxException {
        log.debug("REST request to partial update Interview partially : {}, {}", id, interview);
        if (interview.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, interview.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!interviewRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Interview> result = interviewRepository
            .findById(interview.getId())
            .map(existingInterview -> {
                if (interview.getDetails() != null) {
                    existingInterview.setDetails(interview.getDetails());
                }

                return existingInterview;
            })
            .map(interviewRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, interview.getId().toString())
        );
    }

    /**
     * {@code GET  /interviews} : get all the interviews.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of interviews in body.
     */
    @GetMapping("/interviews")
    public List<Interview> getAllInterviews(
        @RequestParam(required = false) String filter,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
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

    /**
     * {@code GET  /interviews/:id} : get the "id" interview.
     *
     * @param id the id of the interview to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the interview, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/interviews/{id}")
    public ResponseEntity<Interview> getInterview(@PathVariable Long id) {
        log.debug("REST request to get Interview : {}", id);
        Optional<Interview> interview = interviewRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(interview);
    }

    /**
     * {@code DELETE  /interviews/:id} : delete the "id" interview.
     *
     * @param id the id of the interview to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/interviews/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        log.debug("REST request to delete Interview : {}", id);
        interviewRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
