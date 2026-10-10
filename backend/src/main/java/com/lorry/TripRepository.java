package com.lorry;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);

    @Query("""
        select t from Trip t where t.userId = :uid and lower(concat(
          coalesce(t.fromAddr,''),' ',coalesce(t.toAddr,''),' ',coalesce(t.payer,''),' ',t.type,' ',t.pickup))
          like lower(concat('%', :q, '%'))
        order by t.createdAt desc""")
    List<Trip> search(@Param("uid") Long uid, @Param("q") String q);
}
