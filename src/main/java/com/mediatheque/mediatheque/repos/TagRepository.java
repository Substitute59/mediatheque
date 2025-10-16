package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TagRepository extends JpaRepository<Tag, Integer> {
}
