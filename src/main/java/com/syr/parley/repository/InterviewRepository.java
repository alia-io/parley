package com.syr.parley.repository;

import com.syr.parley.domain.Interview;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Interview entity.
 */
@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    @Query(
        value = "select distinct interview from Interview interview left join fetch interview.questions",
        countQuery = "select count(distinct interview) from Interview interview"
    )
    Page<Interview> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct interview from Interview interview left join fetch interview.questions")
    List<Interview> findAllWithEagerRelationships();

    @Query("select interview from Interview interview left join fetch interview.questions where interview.id =:id")
    Optional<Interview> findOneWithEagerRelationships(@Param("id") Long id);
}
