package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.User;
import com.mediatheque.mediatheque.repos.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.Optional;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PasswordResetService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public String requestPasswordReset(String usernameOrEmail) {
        Optional<User> optional = userRepository.findByUsername(usernameOrEmail);
        if (optional.isEmpty()) {
            // Ne pas divulguer si l'email existe ou non en prod — retourner ok
            return null;
        }
        User user = optional.get();
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiration(OffsetDateTime.now().plusHours(1)); // valide 1h
        userRepository.save(user);

        try {
            emailService.sendPasswordResetEmail(user.getUsername(), token);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return token;
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<User> optional = userRepository.findByResetToken(token);
        if (optional.isEmpty()) return false;

        User user = optional.get();
        if (user.getResetTokenExpiration() == null || user.getResetTokenExpiration().isBefore(OffsetDateTime.now())) {
            return false; // token expiré
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiration(null);
        userRepository.save(user);
        return true;
    }
}
