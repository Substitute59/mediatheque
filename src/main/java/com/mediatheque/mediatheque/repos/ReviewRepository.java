package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ReviewRepository extends JpaRepository<Review, Integer> {

    Review findFirstByMediaId(Integer id);

    Review findFirstByUserId(Integer id);

}
