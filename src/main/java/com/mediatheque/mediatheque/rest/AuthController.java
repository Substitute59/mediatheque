package com.mediatheque.mediatheque.rest;

import com.mediatheque.mediatheque.config.R2Config;
import com.mediatheque.mediatheque.domain.User;
import com.mediatheque.mediatheque.repos.UserRepository;
import com.mediatheque.mediatheque.security.JwtTokenProvider;
import com.mediatheque.mediatheque.service.PasswordResetService;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.Map;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private S3Client s3Client;

    @Autowired
    private R2Config r2Config;

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final PasswordResetService passwordResetService;

    public AuthController(
        UserRepository userRepository,
        JwtTokenProvider jwtTokenProvider,
        PasswordResetService passwordResetService
    ) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
        @RequestParam("username") String username,
        @RequestParam("password") String password,
        @RequestParam(value = "avatar", required = false) MultipartFile avatar
    ) throws IOException {
        User user = userRepository.findAll()
                .stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst()
                .orElse(null);

        if (user != null) {
            return ResponseEntity.status(401).body(Map.of("error", "Email already used"));
        }

        user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");
        user.setCreatedAt(OffsetDateTime.now());
        
        if (avatar != null && !avatar.isEmpty()) {
            // Nouveau nom unique
            String fileName = UUID.randomUUID() + "_" + avatar.getOriginalFilename();
            // Upload vers Cloudflare R2
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(r2Config.getBucket())
                            .key(fileName)
                            .contentType(avatar.getContentType())
                            .build(),
                    RequestBody.fromBytes(avatar.getBytes())
            );
            // URL publique pour Angular
            String publicUrl = r2Config.getPublicUrl() + "/" + fileName;
            user.setAvatar(publicUrl);
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@org.springframework.web.bind.annotation.RequestBody Map<String, String> req) {
        User user = userRepository.findAll()
                .stream()
                .filter(u -> u.getUsername().equals(req.get("username")))
                .findFirst()
                .orElse(null);

        if (user == null || !passwordEncoder.matches(req.get("password"), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtTokenProvider.generateToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "token", token,
            "refreshToken", refreshToken
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@org.springframework.web.bind.annotation.RequestBody Map<String, String> req) {
        String refreshToken = req.get("refreshToken");

        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing refresh token"));
        }

        User user = userRepository.findAll()
                .stream()
                .filter(u -> refreshToken.equals(u.getRefreshToken()))
                .findFirst()
                .orElse(null);

        if (user == null || !jwtTokenProvider.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired refresh token"));
        }

        String newToken = jwtTokenProvider.generateToken(user);
        return ResponseEntity.ok(Map.of("token", newToken));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@org.springframework.web.bind.annotation.RequestBody Map<String, String> body) {
        String username = body.get("email");
        passwordResetService.requestPasswordReset(username);
        return ResponseEntity.ok(Map.of("message", "If an account exists, a reset link was sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@org.springframework.web.bind.annotation.RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("password");
        boolean ok = passwordResetService.resetPassword(token, newPassword);
        if (!ok) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token"));
        }
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
}
