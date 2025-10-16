package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.Flag;
import org.springframework.data.jpa.repository.JpaRepository;


public interface FlagRepository extends JpaRepository<Flag, Integer> {
}
