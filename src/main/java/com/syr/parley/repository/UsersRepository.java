package com.syr.parley.repository;

import com.syr.parley.domain.Users;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Users entity.
 */
@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    @Query(
        value = "select distinct users from Users users left join fetch users.interviews",
        countQuery = "select count(distinct users) from Users users"
    )
    Page<Users> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct users from Users users left join fetch users.interviews")
    List<Users> findAllWithEagerRelationships();

    @Query("select users from Users users left join fetch users.interviews where users.id =:id")
    Optional<Users> findOneWithEagerRelationships(@Param("id") Long id);

    @Query(value = "select * from users where users.user_id =:id", nativeQuery = true)
    Optional<Users> findOneByUserId(@Param("id") Long id);
}
