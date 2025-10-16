package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.MediaCollection;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MediaCollectionRepository extends JpaRepository<MediaCollection, Integer> {

    MediaCollection findFirstByMediaId(Integer id);

    MediaCollection findFirstByCollectionId(Integer id);

}
