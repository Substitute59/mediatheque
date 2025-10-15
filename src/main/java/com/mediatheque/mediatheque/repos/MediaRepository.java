package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.Media;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MediaRepository extends JpaRepository<Media, Long> {
}
