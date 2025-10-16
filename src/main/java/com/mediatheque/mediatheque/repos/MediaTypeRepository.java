package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MediaTypeRepository extends JpaRepository<MediaType, Integer> {
}
