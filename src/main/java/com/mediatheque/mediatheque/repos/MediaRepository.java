package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.Media;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MediaRepository extends JpaRepository<Media, Integer> {

    Media findFirstByMediaTypeId(Integer id);

    Media findFirstByGenreId(Integer id);

    Media findFirstByPlatformId(Integer id);

    Media findFirstByFlagId(Integer id);

    Media findFirstByCreatedById(Integer id);

    List<Media> findAllByMediaTagTagsId(Integer id);

}
