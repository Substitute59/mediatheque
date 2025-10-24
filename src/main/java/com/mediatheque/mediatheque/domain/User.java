package com.mediatheque.mediatheque.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;


@Entity
public class User {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column
    private String avatar;

    @Column
    private String refreshToken;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiration")
    private OffsetDateTime resetTokenExpiration;

    @Column(name = "\"role\"")
    private String role;

    @Column
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "createdBy")
    private Set<Media> createdByMedias = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Review> userReviews = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<UserMedia> userUserMedias = new HashSet<>();

    public Integer getId() {
        return id;
    }

    public void setId(final Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(final String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(final String password) {
        this.password = password;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(final String avatar) {
        this.avatar = avatar;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(final String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public OffsetDateTime getResetTokenExpiration() {
        return resetTokenExpiration;
    }

    public void setResetTokenExpiration(OffsetDateTime resetTokenExpiration) {
        this.resetTokenExpiration = resetTokenExpiration;
    }

    public String getRole() {
        return role;
    }

    public void setRole(final String role) {
        this.role = role;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(final OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Set<Media> getCreatedByMedias() {
        return createdByMedias;
    }

    public void setCreatedByMedias(final Set<Media> createdByMedias) {
        this.createdByMedias = createdByMedias;
    }

    public Set<Review> getUserReviews() {
        return userReviews;
    }

    public void setUserReviews(final Set<Review> userReviews) {
        this.userReviews = userReviews;
    }

    public Set<UserMedia> getUserUserMedias() {
        return userUserMedias;
    }

    public void setUserUserMedias(final Set<UserMedia> userUserMedias) {
        this.userUserMedias = userUserMedias;
    }

}
