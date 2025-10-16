package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.Genre;
import org.springframework.data.jpa.repository.JpaRepository;


public interface GenreRepository extends JpaRepository<Genre, Integer> {

    Genre findFirstByMediaTypeId(Integer id);

}
