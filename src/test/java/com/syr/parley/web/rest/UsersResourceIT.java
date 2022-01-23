package com.syr.parley.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.syr.parley.IntegrationTest;
import com.syr.parley.domain.Users;
import com.syr.parley.repository.UsersRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UsersResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class UsersResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UsersRepository usersRepository;

    @Mock
    private UsersRepository usersRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUsersMockMvc;

    private Users users;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Users createEntity(EntityManager em) {
        Users users = new Users().firstName(DEFAULT_FIRST_NAME).lastName(DEFAULT_LAST_NAME);
        return users;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Users createUpdatedEntity(EntityManager em) {
        Users users = new Users().firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);
        return users;
    }

    @BeforeEach
    public void initTest() {
        users = createEntity(em);
    }

    @Test
    @Transactional
    void createUsers() throws Exception {
        int databaseSizeBeforeCreate = usersRepository.findAll().size();
        // Create the Users
        restUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(users)))
            .andExpect(status().isCreated());

        // Validate the Users in the database
        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeCreate + 1);
        Users testUsers = usersList.get(usersList.size() - 1);
        assertThat(testUsers.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testUsers.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
    }

    @Test
    @Transactional
    void createUsersWithExistingId() throws Exception {
        // Create the Users with an existing ID
        users.setId(1L);

        int databaseSizeBeforeCreate = usersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(users)))
            .andExpect(status().isBadRequest());

        // Validate the Users in the database
        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = usersRepository.findAll().size();
        // set the field null
        users.setFirstName(null);

        // Create the Users, which fails.

        restUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(users)))
            .andExpect(status().isBadRequest());

        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = usersRepository.findAll().size();
        // set the field null
        users.setLastName(null);

        // Create the Users, which fails.

        restUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(users)))
            .andExpect(status().isBadRequest());

        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUsers() throws Exception {
        // Initialize the database
        usersRepository.saveAndFlush(users);

        // Get all the usersList
        restUsersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(users.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUsersWithEagerRelationshipsIsEnabled() throws Exception {
        when(usersRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUsersMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(usersRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUsersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(usersRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUsersMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(usersRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getUsers() throws Exception {
        // Initialize the database
        usersRepository.saveAndFlush(users);

        // Get the users
        restUsersMockMvc
            .perform(get(ENTITY_API_URL_ID, users.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(users.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME));
    }

    @Test
    @Transactional
    void getNonExistingUsers() throws Exception {
        // Get the users
        restUsersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUsers() throws Exception {
        // Initialize the database
        usersRepository.saveAndFlush(users);

        int databaseSizeBeforeUpdate = usersRepository.findAll().size();

        // Update the users
        Users updatedUsers = usersRepository.findById(users.getId()).get();
        // Disconnect from session so that the updates on updatedUsers are not directly saved in db
        em.detach(updatedUsers);
        updatedUsers.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);

        restUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUsers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUsers))
            )
            .andExpect(status().isOk());

        // Validate the Users in the database
        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeUpdate);
        Users testUsers = usersList.get(usersList.size() - 1);
        assertThat(testUsers.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testUsers.getLastName()).isEqualTo(UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void putNonExistingUsers() throws Exception {
        int databaseSizeBeforeUpdate = usersRepository.findAll().size();
        users.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, users.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(users))
            )
            .andExpect(status().isBadRequest());

        // Validate the Users in the database
        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUsers() throws Exception {
        int databaseSizeBeforeUpdate = usersRepository.findAll().size();
        users.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(users))
            )
            .andExpect(status().isBadRequest());

        // Validate the Users in the database
        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUsers() throws Exception {
        int databaseSizeBeforeUpdate = usersRepository.findAll().size();
        users.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsersMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(users)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Users in the database
        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUsersWithPatch() throws Exception {
        // Initialize the database
        usersRepository.saveAndFlush(users);

        int databaseSizeBeforeUpdate = usersRepository.findAll().size();

        // Update the users using partial update
        Users partialUpdatedUsers = new Users();
        partialUpdatedUsers.setId(users.getId());

        partialUpdatedUsers.lastName(UPDATED_LAST_NAME);

        restUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUsers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUsers))
            )
            .andExpect(status().isOk());

        // Validate the Users in the database
        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeUpdate);
        Users testUsers = usersList.get(usersList.size() - 1);
        assertThat(testUsers.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testUsers.getLastName()).isEqualTo(UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void fullUpdateUsersWithPatch() throws Exception {
        // Initialize the database
        usersRepository.saveAndFlush(users);

        int databaseSizeBeforeUpdate = usersRepository.findAll().size();

        // Update the users using partial update
        Users partialUpdatedUsers = new Users();
        partialUpdatedUsers.setId(users.getId());

        partialUpdatedUsers.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);

        restUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUsers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUsers))
            )
            .andExpect(status().isOk());

        // Validate the Users in the database
        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeUpdate);
        Users testUsers = usersList.get(usersList.size() - 1);
        assertThat(testUsers.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testUsers.getLastName()).isEqualTo(UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingUsers() throws Exception {
        int databaseSizeBeforeUpdate = usersRepository.findAll().size();
        users.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, users.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(users))
            )
            .andExpect(status().isBadRequest());

        // Validate the Users in the database
        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUsers() throws Exception {
        int databaseSizeBeforeUpdate = usersRepository.findAll().size();
        users.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(users))
            )
            .andExpect(status().isBadRequest());

        // Validate the Users in the database
        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUsers() throws Exception {
        int databaseSizeBeforeUpdate = usersRepository.findAll().size();
        users.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsersMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(users)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Users in the database
        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUsers() throws Exception {
        // Initialize the database
        usersRepository.saveAndFlush(users);

        int databaseSizeBeforeDelete = usersRepository.findAll().size();

        // Delete the users
        restUsersMockMvc
            .perform(delete(ENTITY_API_URL_ID, users.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Users> usersList = usersRepository.findAll();
        assertThat(usersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
