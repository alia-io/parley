package com.syr.parley.repository;

import com.syr.parley.domain.Question;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Question entity.
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query(
        value = "select distinct question from Question question left join fetch question.attributes",
        countQuery = "select count(distinct question) from Question question"
    )
    Page<Question> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct question from Question question left join fetch question.attributes left join fetch question.interviews")
    List<Question> findAllWithEagerRelationships();

    @Query("select question from Question question left join fetch question.attributes where question.id =:id")
    Optional<Question> findOneWithEagerRelationships(@Param("id") Long id);
}
