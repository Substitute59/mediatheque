package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.Flag;
import com.mediatheque.mediatheque.domain.Media;
import com.mediatheque.mediatheque.domain.User;
import com.mediatheque.mediatheque.domain.UserMedia;
import com.mediatheque.mediatheque.events.BeforeDeleteFlag;
import com.mediatheque.mediatheque.events.BeforeDeleteMedia;
import com.mediatheque.mediatheque.events.BeforeDeleteUser;
import com.mediatheque.mediatheque.model.UserMediaDTO;
import com.mediatheque.mediatheque.repos.FlagRepository;
import com.mediatheque.mediatheque.repos.MediaRepository;
import com.mediatheque.mediatheque.repos.UserMediaRepository;
import com.mediatheque.mediatheque.repos.UserRepository;
import com.mediatheque.mediatheque.util.NotFoundException;
import com.mediatheque.mediatheque.util.ReferencedException;
import java.util.List;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class UserMediaService {

    private final UserMediaRepository userMediaRepository;
    private final UserRepository userRepository;
    private final MediaRepository mediaRepository;
    private final FlagRepository flagRepository;

    public UserMediaService(final UserMediaRepository userMediaRepository,
            final UserRepository userRepository, final MediaRepository mediaRepository,
            final FlagRepository flagRepository) {
        this.userMediaRepository = userMediaRepository;
        this.userRepository = userRepository;
        this.mediaRepository = mediaRepository;
        this.flagRepository = flagRepository;
    }

    public List<UserMediaDTO> findAll() {
        final List<UserMedia> userMedias = userMediaRepository.findAll(Sort.by("id"));
        return userMedias.stream()
                .map(userMedia -> mapToDTO(userMedia, new UserMediaDTO()))
                .toList();
    }

    public UserMediaDTO get(final Integer id) {
        return userMediaRepository.findById(id)
                .map(userMedia -> mapToDTO(userMedia, new UserMediaDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final UserMediaDTO userMediaDTO) {
        final UserMedia userMedia = new UserMedia();
        mapToEntity(userMediaDTO, userMedia);
        return userMediaRepository.save(userMedia).getId();
    }

    public void update(final Integer id, final UserMediaDTO userMediaDTO) {
        final UserMedia userMedia = userMediaRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(userMediaDTO, userMedia);
        userMediaRepository.save(userMedia);
    }

    public void delete(final Integer id) {
        final UserMedia userMedia = userMediaRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        userMediaRepository.delete(userMedia);
    }

    private UserMediaDTO mapToDTO(final UserMedia userMedia, final UserMediaDTO userMediaDTO) {
        userMediaDTO.setId(userMedia.getId());
        userMediaDTO.setUser(userMedia.getUser() == null ? null : userMedia.getUser().getId());
        userMediaDTO.setMedia(userMedia.getMedia() == null ? null : userMedia.getMedia().getId());
        userMediaDTO.setFlag(userMedia.getFlag() == null ? null : userMedia.getFlag().getId());
        return userMediaDTO;
    }

    private UserMedia mapToEntity(final UserMediaDTO userMediaDTO, final UserMedia userMedia) {
        final User user = userMediaDTO.getUser() == null ? null : userRepository.findById(userMediaDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        userMedia.setUser(user);
        final Media media = userMediaDTO.getMedia() == null ? null : mediaRepository.findById(userMediaDTO.getMedia())
                .orElseThrow(() -> new NotFoundException("media not found"));
        userMedia.setMedia(media);
        final Flag flag = userMediaDTO.getFlag() == null ? null : flagRepository.findById(userMediaDTO.getFlag())
                .orElseThrow(() -> new NotFoundException("flag not found"));
        userMedia.setFlag(flag);
        return userMedia;
    }

    @EventListener(BeforeDeleteUser.class)
    public void on(final BeforeDeleteUser event) {
        final ReferencedException referencedException = new ReferencedException();
        final UserMedia userUserMedia = userMediaRepository.findFirstByUserId(event.getId());
        if (userUserMedia != null) {
            referencedException.setKey("user.userMedia.user.referenced");
            referencedException.addParam(userUserMedia.getId());
            throw referencedException;
        }
    }

    @EventListener(BeforeDeleteMedia.class)
    public void on(final BeforeDeleteMedia event) {
        final ReferencedException referencedException = new ReferencedException();
        final UserMedia mediaUserMedia = userMediaRepository.findFirstByMediaId(event.getId());
        if (mediaUserMedia != null) {
            referencedException.setKey("media.userMedia.media.referenced");
            referencedException.addParam(mediaUserMedia.getId());
            throw referencedException;
        }
    }

    @EventListener(BeforeDeleteFlag.class)
    public void on(final BeforeDeleteFlag event) {
        final ReferencedException referencedException = new ReferencedException();
        final UserMedia flagUserMedia = userMediaRepository.findFirstByFlagId(event.getId());
        if (flagUserMedia != null) {
            referencedException.setKey("flag.userMedia.flag.referenced");
            referencedException.addParam(flagUserMedia.getId());
            throw referencedException;
        }
    }

}
