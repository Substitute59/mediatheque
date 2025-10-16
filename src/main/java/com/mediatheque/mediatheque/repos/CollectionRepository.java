package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.Collection;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CollectionRepository extends JpaRepository<Collection, Integer> {
}
