package com.syr.parley.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.syr.parley.IntegrationTest;
import com.syr.parley.domain.Interview;
import com.syr.parley.repository.InterviewRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link InterviewResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InterviewResourceIT {

    private static final String DEFAULT_DETAILS = "AAAAAAAAAA";
    private static final String UPDATED_DETAILS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/interviews";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInterviewMockMvc;

    private Interview interview;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Interview createEntity(EntityManager em) {
        Interview interview = new Interview().details(DEFAULT_DETAILS);
        return interview;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Interview createUpdatedEntity(EntityManager em) {
        Interview interview = new Interview().details(UPDATED_DETAILS);
        return interview;
    }

    @BeforeEach
    public void initTest() {
        interview = createEntity(em);
    }

    @Test
    @Transactional
    void createInterview() throws Exception {
        int databaseSizeBeforeCreate = interviewRepository.findAll().size();
        // Create the Interview
        restInterviewMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(interview)))
            .andExpect(status().isCreated());

        // Validate the Interview in the database
        List<Interview> interviewList = interviewRepository.findAll();
        assertThat(interviewList).hasSize(databaseSizeBeforeCreate + 1);
        Interview testInterview = interviewList.get(interviewList.size() - 1);
        assertThat(testInterview.getDetails()).isEqualTo(DEFAULT_DETAILS);
    }

    @Test
    @Transactional
    void createInterviewWithExistingId() throws Exception {
        // Create the Interview with an existing ID
        interview.setId(1L);

        int databaseSizeBeforeCreate = interviewRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInterviewMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(interview)))
            .andExpect(status().isBadRequest());

        // Validate the Interview in the database
        List<Interview> interviewList = interviewRepository.findAll();
        assertThat(interviewList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInterviews() throws Exception {
        // Initialize the database
        interviewRepository.saveAndFlush(interview);

        // Get all the interviewList
        restInterviewMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(interview.getId().intValue())))
            .andExpect(jsonPath("$.[*].details").value(hasItem(DEFAULT_DETAILS)));
    }

    @Test
    @Transactional
    void getInterview() throws Exception {
        // Initialize the database
        interviewRepository.saveAndFlush(interview);

        // Get the interview
        restInterviewMockMvc
            .perform(get(ENTITY_API_URL_ID, interview.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(interview.getId().intValue()))
            .andExpect(jsonPath("$.details").value(DEFAULT_DETAILS));
    }

    @Test
    @Transactional
    void getNonExistingInterview() throws Exception {
        // Get the interview
        restInterviewMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewInterview() throws Exception {
        // Initialize the database
        interviewRepository.saveAndFlush(interview);

        int databaseSizeBeforeUpdate = interviewRepository.findAll().size();

        // Update the interview
        Interview updatedInterview = interviewRepository.findById(interview.getId()).get();
        // Disconnect from session so that the updates on updatedInterview are not directly saved in db
        em.detach(updatedInterview);
        updatedInterview.details(UPDATED_DETAILS);

        restInterviewMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInterview.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInterview))
            )
            .andExpect(status().isOk());

        // Validate the Interview in the database
        List<Interview> interviewList = interviewRepository.findAll();
        assertThat(interviewList).hasSize(databaseSizeBeforeUpdate);
        Interview testInterview = interviewList.get(interviewList.size() - 1);
        assertThat(testInterview.getDetails()).isEqualTo(UPDATED_DETAILS);
    }

    @Test
    @Transactional
    void putNonExistingInterview() throws Exception {
        int databaseSizeBeforeUpdate = interviewRepository.findAll().size();
        interview.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInterviewMockMvc
            .perform(
                put(ENTITY_API_URL_ID, interview.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(interview))
            )
            .andExpect(status().isBadRequest());

        // Validate the Interview in the database
        List<Interview> interviewList = interviewRepository.findAll();
        assertThat(interviewList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInterview() throws Exception {
        int databaseSizeBeforeUpdate = interviewRepository.findAll().size();
        interview.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterviewMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(interview))
            )
            .andExpect(status().isBadRequest());

        // Validate the Interview in the database
        List<Interview> interviewList = interviewRepository.findAll();
        assertThat(interviewList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInterview() throws Exception {
        int databaseSizeBeforeUpdate = interviewRepository.findAll().size();
        interview.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterviewMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(interview)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Interview in the database
        List<Interview> interviewList = interviewRepository.findAll();
        assertThat(interviewList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInterviewWithPatch() throws Exception {
        // Initialize the database
        interviewRepository.saveAndFlush(interview);

        int databaseSizeBeforeUpdate = interviewRepository.findAll().size();

        // Update the interview using partial update
        Interview partialUpdatedInterview = new Interview();
        partialUpdatedInterview.setId(interview.getId());

        restInterviewMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInterview.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInterview))
            )
            .andExpect(status().isOk());

        // Validate the Interview in the database
        List<Interview> interviewList = interviewRepository.findAll();
        assertThat(interviewList).hasSize(databaseSizeBeforeUpdate);
        Interview testInterview = interviewList.get(interviewList.size() - 1);
        assertThat(testInterview.getDetails()).isEqualTo(DEFAULT_DETAILS);
    }

    @Test
    @Transactional
    void fullUpdateInterviewWithPatch() throws Exception {
        // Initialize the database
        interviewRepository.saveAndFlush(interview);

        int databaseSizeBeforeUpdate = interviewRepository.findAll().size();

        // Update the interview using partial update
        Interview partialUpdatedInterview = new Interview();
        partialUpdatedInterview.setId(interview.getId());

        partialUpdatedInterview.details(UPDATED_DETAILS);

        restInterviewMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInterview.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInterview))
            )
            .andExpect(status().isOk());

        // Validate the Interview in the database
        List<Interview> interviewList = interviewRepository.findAll();
        assertThat(interviewList).hasSize(databaseSizeBeforeUpdate);
        Interview testInterview = interviewList.get(interviewList.size() - 1);
        assertThat(testInterview.getDetails()).isEqualTo(UPDATED_DETAILS);
    }

    @Test
    @Transactional
    void patchNonExistingInterview() throws Exception {
        int databaseSizeBeforeUpdate = interviewRepository.findAll().size();
        interview.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInterviewMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, interview.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(interview))
            )
            .andExpect(status().isBadRequest());

        // Validate the Interview in the database
        List<Interview> interviewList = interviewRepository.findAll();
        assertThat(interviewList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInterview() throws Exception {
        int databaseSizeBeforeUpdate = interviewRepository.findAll().size();
        interview.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterviewMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(interview))
            )
            .andExpect(status().isBadRequest());

        // Validate the Interview in the database
        List<Interview> interviewList = interviewRepository.findAll();
        assertThat(interviewList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInterview() throws Exception {
        int databaseSizeBeforeUpdate = interviewRepository.findAll().size();
        interview.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterviewMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(interview))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Interview in the database
        List<Interview> interviewList = interviewRepository.findAll();
        assertThat(interviewList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInterview() throws Exception {
        // Initialize the database
        interviewRepository.saveAndFlush(interview);

        int databaseSizeBeforeDelete = interviewRepository.findAll().size();

        // Delete the interview
        restInterviewMockMvc
            .perform(delete(ENTITY_API_URL_ID, interview.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Interview> interviewList = interviewRepository.findAll();
        assertThat(interviewList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
