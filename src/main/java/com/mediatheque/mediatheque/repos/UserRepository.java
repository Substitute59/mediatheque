package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Integer> {
}
