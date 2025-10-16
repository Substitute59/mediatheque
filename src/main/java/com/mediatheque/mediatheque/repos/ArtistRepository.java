package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.Artist;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ArtistRepository extends JpaRepository<Artist, Integer> {
}
