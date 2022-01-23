package com.syr.parley.repository;

import com.syr.parley.domain.Question;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Question entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {}
