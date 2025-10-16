package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.Platform;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PlatformRepository extends JpaRepository<Platform, Integer> {
}
