package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.MediaArtist;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface MediaArtistRepository extends JpaRepository<MediaArtist, Integer> {

    MediaArtist findFirstByMediaId(Integer id);

    MediaArtist findFirstByArtistId(Integer id);

    List<MediaArtist> findAllByMediaId(Integer id);

}
