package com.mediatheque.mediatheque.repos;

import com.mediatheque.mediatheque.domain.UserMedia;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface UserMediaRepository extends JpaRepository<UserMedia, Integer> {

    UserMedia findFirstByUserId(Integer id);

    UserMedia findFirstByMediaId(Integer id);

    UserMedia findFirstByFlagId(Integer id);

    List<UserMedia> findByUserId(Integer userId);

}
