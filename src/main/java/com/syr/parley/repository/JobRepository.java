package com.syr.parley.repository;

import com.syr.parley.domain.Job;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Job entity.
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    @Query(
        value = "select distinct job from Job job left join fetch job.interviews",
        countQuery = "select count(distinct job) from Job job"
    )
    Page<Job> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct job from Job job left join fetch job.interviews")
    List<Job> findAllWithEagerRelationships();

    @Query("select job from Job job left join fetch job.interviews where job.id =:id")
    Optional<Job> findOneWithEagerRelationships(@Param("id") Long id);
}
