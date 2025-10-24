package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username); // si tu veux lookup par email/username
    Optional<User> findByResetToken(String resetToken);
}
