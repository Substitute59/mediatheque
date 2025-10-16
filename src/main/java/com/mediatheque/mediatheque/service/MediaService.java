package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.Flag;
import com.mediatheque.mediatheque.domain.Genre;
import com.mediatheque.mediatheque.domain.Media;
import com.mediatheque.mediatheque.domain.MediaType;
import com.mediatheque.mediatheque.domain.Platform;
import com.mediatheque.mediatheque.domain.Tag;
import com.mediatheque.mediatheque.domain.User;
import com.mediatheque.mediatheque.events.BeforeDeleteFlag;
import com.mediatheque.mediatheque.events.BeforeDeleteGenre;
import com.mediatheque.mediatheque.events.BeforeDeleteMedia;
import com.mediatheque.mediatheque.events.BeforeDeleteMediaType;
import com.mediatheque.mediatheque.events.BeforeDeletePlatform;
import com.mediatheque.mediatheque.events.BeforeDeleteTag;
import com.mediatheque.mediatheque.events.BeforeDeleteUser;
import com.mediatheque.mediatheque.model.MediaDTO;
import com.mediatheque.mediatheque.repos.FlagRepository;
import com.mediatheque.mediatheque.repos.GenreRepository;
import com.mediatheque.mediatheque.repos.MediaRepository;
import com.mediatheque.mediatheque.repos.MediaTypeRepository;
import com.mediatheque.mediatheque.repos.PlatformRepository;
import com.mediatheque.mediatheque.repos.TagRepository;
import com.mediatheque.mediatheque.repos.UserRepository;
import com.mediatheque.mediatheque.util.CustomCollectors;
import com.mediatheque.mediatheque.util.NotFoundException;
import com.mediatheque.mediatheque.util.ReferencedException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional(rollbackFor = Exception.class)
public class MediaService {

    private final MediaRepository mediaRepository;
    private final MediaTypeRepository mediaTypeRepository;
    private final GenreRepository genreRepository;
    private final PlatformRepository platformRepository;
    private final FlagRepository flagRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final ApplicationEventPublisher publisher;

    public MediaService(final MediaRepository mediaRepository,
            final MediaTypeRepository mediaTypeRepository, final GenreRepository genreRepository,
            final PlatformRepository platformRepository, final FlagRepository flagRepository,
            final UserRepository userRepository, final TagRepository tagRepository,
            final ApplicationEventPublisher publisher) {
        this.mediaRepository = mediaRepository;
        this.mediaTypeRepository = mediaTypeRepository;
        this.genreRepository = genreRepository;
        this.platformRepository = platformRepository;
        this.flagRepository = flagRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
        this.publisher = publisher;
    }

    public List<MediaDTO> findAll() {
        final List<Media> medias = mediaRepository.findAll(Sort.by("id"));
        return medias.stream()
                .map(media -> mapToDTO(media, new MediaDTO()))
                .toList();
    }

    public MediaDTO get(final Integer id) {
        return mediaRepository.findById(id)
                .map(media -> mapToDTO(media, new MediaDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final MediaDTO mediaDTO) {
        final Media media = new Media();
        mapToEntity(mediaDTO, media);
        return mediaRepository.save(media).getId();
    }

    public void update(final Integer id, final MediaDTO mediaDTO) {
        final Media media = mediaRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(mediaDTO, media);
        mediaRepository.save(media);
    }

    public void delete(final Integer id) {
        final Media media = mediaRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        publisher.publishEvent(new BeforeDeleteMedia(id));
        mediaRepository.delete(media);
    }

    private MediaDTO mapToDTO(final Media media, final MediaDTO mediaDTO) {
        mediaDTO.setId(media.getId());
        mediaDTO.setTitle(media.getTitle());
        mediaDTO.setDescription(media.getDescription());
        mediaDTO.setCoverUrl(media.getCoverUrl());
        mediaDTO.setCreatedAt(media.getCreatedAt());
        mediaDTO.setUpdatedAt(media.getUpdatedAt());
        mediaDTO.setMediaType(media.getMediaType() == null ? null : media.getMediaType().getId());
        mediaDTO.setGenre(media.getGenre() == null ? null : media.getGenre().getId());
        mediaDTO.setPlatform(media.getPlatform() == null ? null : media.getPlatform().getId());
        mediaDTO.setFlag(media.getFlag() == null ? null : media.getFlag().getId());
        mediaDTO.setCreatedBy(media.getCreatedBy() == null ? null : media.getCreatedBy().getId());
        mediaDTO.setMediaTagTags(media.getMediaTagTags().stream()
                .map(tag -> tag.getId())
                .toList());
        return mediaDTO;
    }

    private Media mapToEntity(final MediaDTO mediaDTO, final Media media) {
        media.setTitle(mediaDTO.getTitle());
        media.setDescription(mediaDTO.getDescription());
        media.setCoverUrl(mediaDTO.getCoverUrl());
        media.setCreatedAt(mediaDTO.getCreatedAt());
        media.setUpdatedAt(mediaDTO.getUpdatedAt());
        final MediaType mediaType = mediaDTO.getMediaType() == null ? null : mediaTypeRepository.findById(mediaDTO.getMediaType())
                .orElseThrow(() -> new NotFoundException("mediaType not found"));
        media.setMediaType(mediaType);
        final Genre genre = mediaDTO.getGenre() == null ? null : genreRepository.findById(mediaDTO.getGenre())
                .orElseThrow(() -> new NotFoundException("genre not found"));
        media.setGenre(genre);
        final Platform platform = mediaDTO.getPlatform() == null ? null : platformRepository.findById(mediaDTO.getPlatform())
                .orElseThrow(() -> new NotFoundException("platform not found"));
        media.setPlatform(platform);
        final Flag flag = mediaDTO.getFlag() == null ? null : flagRepository.findById(mediaDTO.getFlag())
                .orElseThrow(() -> new NotFoundException("flag not found"));
        media.setFlag(flag);
        final User createdBy = mediaDTO.getCreatedBy() == null ? null : userRepository.findById(mediaDTO.getCreatedBy())
                .orElseThrow(() -> new NotFoundException("createdBy not found"));
        media.setCreatedBy(createdBy);
        final List<Tag> mediaTagTags = tagRepository.findAllById(
                mediaDTO.getMediaTagTags() == null ? List.of() : mediaDTO.getMediaTagTags());
        if (mediaTagTags.size() != (mediaDTO.getMediaTagTags() == null ? 0 : mediaDTO.getMediaTagTags().size())) {
            throw new NotFoundException("one of mediaTagTags not found");
        }
        media.setMediaTagTags(new HashSet<>(mediaTagTags));
        return media;
    }

    public Map<Integer, String> getMediaValues() {
        return mediaRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Media::getId, Media::getTitle));
    }

    @EventListener(BeforeDeleteMediaType.class)
    public void on(final BeforeDeleteMediaType event) {
        final ReferencedException referencedException = new ReferencedException();
        final Media mediaTypeMedia = mediaRepository.findFirstByMediaTypeId(event.getId());
        if (mediaTypeMedia != null) {
            referencedException.setKey("mediaType.media.mediaType.referenced");
            referencedException.addParam(mediaTypeMedia.getId());
            throw referencedException;
        }
    }

    @EventListener(BeforeDeleteGenre.class)
    public void on(final BeforeDeleteGenre event) {
        final ReferencedException referencedException = new ReferencedException();
        final Media genreMedia = mediaRepository.findFirstByGenreId(event.getId());
        if (genreMedia != null) {
            referencedException.setKey("genre.media.genre.referenced");
            referencedException.addParam(genreMedia.getId());
            throw referencedException;
        }
    }

    @EventListener(BeforeDeletePlatform.class)
    public void on(final BeforeDeletePlatform event) {
        final ReferencedException referencedException = new ReferencedException();
        final Media platformMedia = mediaRepository.findFirstByPlatformId(event.getId());
        if (platformMedia != null) {
            referencedException.setKey("platform.media.platform.referenced");
            referencedException.addParam(platformMedia.getId());
            throw referencedException;
        }
    }

    @EventListener(BeforeDeleteFlag.class)
    public void on(final BeforeDeleteFlag event) {
        final ReferencedException referencedException = new ReferencedException();
        final Media flagMedia = mediaRepository.findFirstByFlagId(event.getId());
        if (flagMedia != null) {
            referencedException.setKey("flag.media.flag.referenced");
            referencedException.addParam(flagMedia.getId());
            throw referencedException;
        }
    }

    @EventListener(BeforeDeleteUser.class)
    public void on(final BeforeDeleteUser event) {
        final ReferencedException referencedException = new ReferencedException();
        final Media createdByMedia = mediaRepository.findFirstByCreatedById(event.getId());
        if (createdByMedia != null) {
            referencedException.setKey("user.media.createdBy.referenced");
            referencedException.addParam(createdByMedia.getId());
            throw referencedException;
        }
    }

    @EventListener(BeforeDeleteTag.class)
    public void on(final BeforeDeleteTag event) {
        // remove many-to-many relations at owning side
        mediaRepository.findAllByMediaTagTagsId(event.getId()).forEach(media ->
                media.getMediaTagTags().removeIf(tag -> tag.getId().equals(event.getId())));
    }

}
