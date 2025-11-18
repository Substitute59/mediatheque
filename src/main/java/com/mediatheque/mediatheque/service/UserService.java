package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.config.R2Config;
import com.mediatheque.mediatheque.domain.User;
import com.mediatheque.mediatheque.events.BeforeDeleteUser;
import com.mediatheque.mediatheque.model.UserDTO;
import com.mediatheque.mediatheque.repos.UserRepository;
import com.mediatheque.mediatheque.util.CustomCollectors;
import com.mediatheque.mediatheque.util.NotFoundException;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class UserService {

    @Autowired
    private S3Client s3Client;

    @Autowired
    private R2Config r2Config;

    private final UserRepository userRepository;
    private final ApplicationEventPublisher publisher;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(final UserRepository userRepository,
            final ApplicationEventPublisher publisher) {
        this.userRepository = userRepository;
        this.publisher = publisher;
    }

    public List<UserDTO> findAll() {
        final List<User> users = userRepository.findAll(Sort.by("id"));
        return users.stream()
                .map(user -> mapToDTO(user, new UserDTO()))
                .toList();
    }

    public UserDTO get(final Integer id) {
        return userRepository.findById(id)
                .map(user -> mapToDTO(user, new UserDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final UserDTO userDTO) {
        final User user = new User();
        mapToEntity(userDTO, user);
        return userRepository.save(user).getId();
    }

    public void update(final Integer id, final String password, final MultipartFile avatar) throws IOException {
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);

        if (password != null && !password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }

        if (avatar != null && !avatar.isEmpty()) {
            // ----- SUPPRESSION DE L’ANCIEN AVATAR DANS R2 -----
            if (user.getAvatar() != null && !user.getAvatar().isBlank()) {
                try {
                    s3Client.deleteObject(DeleteObjectRequest.builder()
                            .bucket(r2Config.getBucket())
                            .key(user.getAvatar())
                            .build());
                } catch (Exception e) {
                    System.err.println("⚠️ Impossible de supprimer l’ancien avatar sur R2 : " + e.getMessage());
                }
            }
            // ----- UPLOAD DU NOUVEL AVATAR -----
            String newFileName = UUID.randomUUID() + "_" + avatar.getOriginalFilename();
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(r2Config.getBucket())
                            .key(newFileName)
                            .contentType(avatar.getContentType())
                            .build(),
                    RequestBody.fromBytes(avatar.getBytes())
            );
            // URL publique pour afficher dans Angular
            String publicUrl = r2Config.getPublicUrl() + "/" + newFileName;
            user.setAvatar(publicUrl);
        }

        userRepository.save(user);
    }

    public void delete(final Integer id) {
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        publisher.publishEvent(new BeforeDeleteUser(id));
        userRepository.delete(user);
    }

    private UserDTO mapToDTO(final User user, final UserDTO userDTO) {
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setAvatar(user.getAvatar());
        userDTO.setRole(user.getRole());
        userDTO.setCreatedAt(user.getCreatedAt());
        return userDTO;
    }

    private User mapToEntity(final UserDTO userDTO, final User user) {
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setAvatar(userDTO.getAvatar());
        user.setRole(userDTO.getRole());
        user.setCreatedAt(userDTO.getCreatedAt());
        return user;
    }

    public Map<Integer, String> getUserValues() {
        return userRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(User::getId, User::getUsername));
    }

}
