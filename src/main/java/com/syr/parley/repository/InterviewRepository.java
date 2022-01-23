package com.syr.parley.repository;

import com.syr.parley.domain.Interview;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Interview entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {}
