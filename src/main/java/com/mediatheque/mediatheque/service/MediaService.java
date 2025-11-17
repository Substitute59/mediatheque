package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.Genre;
import com.mediatheque.mediatheque.domain.Media;
import com.mediatheque.mediatheque.domain.MediaArtist;
import com.mediatheque.mediatheque.domain.MediaType;
import com.mediatheque.mediatheque.domain.Platform;
import com.mediatheque.mediatheque.domain.Tag;
import com.mediatheque.mediatheque.domain.User;
import com.mediatheque.mediatheque.domain.UserMedia;
import com.mediatheque.mediatheque.events.BeforeDeleteGenre;
import com.mediatheque.mediatheque.events.BeforeDeleteMedia;
import com.mediatheque.mediatheque.events.BeforeDeleteMediaType;
import com.mediatheque.mediatheque.events.BeforeDeletePlatform;
import com.mediatheque.mediatheque.events.BeforeDeleteTag;
import com.mediatheque.mediatheque.events.BeforeDeleteUser;
import com.mediatheque.mediatheque.model.ArtistDTO;
import com.mediatheque.mediatheque.model.CollectionDTO;
import com.mediatheque.mediatheque.model.CompleteMediaDTO;
import com.mediatheque.mediatheque.model.FlagDTO;
import com.mediatheque.mediatheque.model.GenreDTO;
import com.mediatheque.mediatheque.model.MediaArtistDTO;
import com.mediatheque.mediatheque.model.MediaCollectionDTO;
import com.mediatheque.mediatheque.model.MediaDTO;
import com.mediatheque.mediatheque.model.MediaTypeDTO;
import com.mediatheque.mediatheque.model.PlatformDTO;
import com.mediatheque.mediatheque.model.ReviewDTO;
import com.mediatheque.mediatheque.model.TagDTO;
import com.mediatheque.mediatheque.model.UserDTO;
import com.mediatheque.mediatheque.repos.GenreRepository;
import com.mediatheque.mediatheque.repos.MediaRepository;
import com.mediatheque.mediatheque.repos.MediaArtistRepository;
import com.mediatheque.mediatheque.repos.MediaTypeRepository;
import com.mediatheque.mediatheque.repos.PlatformRepository;
import com.mediatheque.mediatheque.repos.TagRepository;
import com.mediatheque.mediatheque.repos.UserMediaRepository;
import com.mediatheque.mediatheque.repos.UserRepository;
import com.mediatheque.mediatheque.util.CustomCollectors;
import com.mediatheque.mediatheque.util.NotFoundException;
import com.mediatheque.mediatheque.util.ReferencedException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional(rollbackFor = Exception.class)
public class MediaService {

    private final MediaArtistService mediaArtistService;

    private final MediaCollectionService mediaCollectionService;

    private final UserMediaRepository userMediaRepository;

    private final MediaRepository mediaRepository;
    private final MediaArtistRepository mediaArtistRepository;
    private final MediaTypeRepository mediaTypeRepository;
    private final GenreRepository genreRepository;
    private final PlatformRepository platformRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final ApplicationEventPublisher publisher;

    public MediaService(final MediaRepository mediaRepository,
            final MediaTypeRepository mediaTypeRepository, final GenreRepository genreRepository,
            final PlatformRepository platformRepository, final UserRepository userRepository,
            final TagRepository tagRepository, final ApplicationEventPublisher publisher,
            final UserMediaRepository userMediaRepository, final MediaCollectionService mediaCollectionService,
            final MediaArtistService mediaArtistService, final MediaArtistRepository mediaArtistRepository) {
        this.mediaRepository = mediaRepository;
        this.mediaArtistRepository = mediaArtistRepository;
        this.mediaTypeRepository = mediaTypeRepository;
        this.genreRepository = genreRepository;
        this.platformRepository = platformRepository;
        this.userMediaRepository = userMediaRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
        this.publisher = publisher;
        this.mediaCollectionService = mediaCollectionService;
        this.mediaArtistService = mediaArtistService;
    }

    public List<MediaDTO> findAll() {
        final List<Media> medias = mediaRepository.findAll(Sort.by("id"));
        return medias.stream()
                .map(media -> mapToDTO(media, new MediaDTO()))
                .toList();
    }

    public List<CompleteMediaDTO> findAllByUserId(Integer userId, Boolean isSearch) {
        if (isSearch) {
            final List<Media> medias = mediaRepository.findAll(Sort.by("id"));

            return medias.stream()
                .map(media -> {
                    UserMedia userMedia = userMediaRepository.findFirstByMediaId(media.getId());
                        if (userMedia == null) {
                            userMedia = new UserMedia();
                            userMedia.setMedia(media);
                        }
                        return userMediaToCompleteMediaDTO(userMedia);
                })
                .toList();
        }

        final List<UserMedia> userMedias = userMediaRepository.findByUserId(userId);

        return userMedias.stream()
                .map(userMedia -> userMediaToCompleteMediaDTO(userMedia))
                .toList();
    }

    public CompleteMediaDTO get(final Integer id) {
        return mediaRepository.findById(id)
                .map(media -> {
                    UserMedia userMedia = userMediaRepository.findFirstByMediaId(id);
                        if (userMedia == null) {
                            userMedia = new UserMedia();
                            userMedia.setMedia(media);
                        }
                        return userMediaToCompleteMediaDTO(userMedia);
                })
                .orElseThrow(NotFoundException::new);
    }

    public CompleteMediaDTO getWithUserData(final Integer id, final Integer userId) {
        return mediaRepository.findById(id)
                .map(media -> {
                    UserMedia userMedia = userMediaRepository.findFirstByUserIdAndMediaId(userId, id)
                            .orElse(null);
                    if (userMedia == null) {
                        userMedia = userMediaRepository.findFirstByMediaId(id);
                        if (userMedia == null) {
                            userMedia = new UserMedia();
                            userMedia.setMedia(media);
                        }
                        return userMediaToCompleteMediaDTO(userMedia);
                    }
                    return userMediaToCompleteMediaDTO(userMedia, true);
                })
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final MediaDTO mediaDTO, final MultipartFile coverFile) throws IOException {
        final Media media = new Media();
        mapToEntity(mediaDTO, media);

        if (coverFile != null && !coverFile.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + coverFile.getOriginalFilename();
            Path uploadPath = Paths.get("uploads");
            Files.createDirectories(uploadPath);
            Files.copy(coverFile.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            media.setCoverUrl(fileName);
        }

        final Integer newMediaId = mediaRepository.save(media).getId();

        if (mediaDTO.getMediaMediaCollections() != null) {
            mediaDTO.getMediaMediaCollections().setMedia(newMediaId);
            mediaCollectionService.create(mediaDTO.getMediaMediaCollections());
        }

        if (mediaDTO.getMediaMediaArtists() != null && !mediaDTO.getMediaMediaArtists().isEmpty()) {
            for (Integer artistId : mediaDTO.getMediaMediaArtists()) {
                MediaArtistDTO mediaArtistDTO = new MediaArtistDTO();
                mediaArtistDTO.setMedia(newMediaId);
                mediaArtistDTO.setArtist(artistId);
                mediaArtistService.create(mediaArtistDTO);
            }
        }

        return newMediaId;
    }

    public void update(final Integer id, final MediaDTO mediaDTO, final MultipartFile coverFile) throws IOException {
        final Media media = mediaRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(mediaDTO, media);

        if (coverFile != null && !coverFile.isEmpty()) {
            Path uploadPath = Paths.get("uploads");

            if (media.getCoverUrl() != null && !media.getCoverUrl().isEmpty()) {
                Path oldAvatarPath = uploadPath.resolve(media.getCoverUrl());
                try {
                    Files.deleteIfExists(oldAvatarPath);
                } catch (IOException e) {
                    System.err.println("❌ Impossible de supprimer l'ancienne couverture : " + e.getMessage());
                }
            }

            String fileName = UUID.randomUUID() + "_" + coverFile.getOriginalFilename();
            Files.createDirectories(uploadPath);
            Files.copy(coverFile.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            media.setCoverUrl(fileName);
        }

        if (mediaDTO.getMediaMediaCollections() != null) {
            mediaDTO.getMediaMediaCollections().setMedia(id);
            mediaCollectionService.update(mediaDTO.getMediaMediaCollections().getId(), mediaDTO.getMediaMediaCollections());
        }

        if (mediaDTO.getMediaMediaArtists() != null && !mediaDTO.getMediaMediaArtists().isEmpty()) {
            Set<Integer> newArtistIds = new HashSet<>(mediaDTO.getMediaMediaArtists());
            List<MediaArtist> existing = mediaArtistRepository.findAllByMediaId(id);

            for (MediaArtist ma : existing) {
                if (!newArtistIds.contains(ma.getArtist().getId())) {
                    mediaArtistRepository.delete(ma);
                } else {
                    newArtistIds.remove(ma.getArtist().getId());
                }
            }

            for (Integer artistId : newArtistIds) {
                MediaArtistDTO dto = new MediaArtistDTO();
                dto.setMedia(id);
                dto.setArtist(artistId);
                mediaArtistService.create(dto);
            }
        }

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
        mediaDTO.setCreatedBy(media.getCreatedBy() == null ? null : media.getCreatedBy().getId());
        mediaDTO.setMediaTagTags(media.getMediaTagTags().stream()
                .map(tag -> tag.getId())
                .toList());
        return mediaDTO;
    }

    private CompleteMediaDTO userMediaToCompleteMediaDTO(final UserMedia userMedia, Boolean... isInUserMediaLibrary) {
        final Media media = userMedia.getMedia();
        final CompleteMediaDTO completeMediaDTO = new CompleteMediaDTO();
        completeMediaDTO.setId(media.getId());
        completeMediaDTO.setTitle(media.getTitle());
        completeMediaDTO.setDescription(media.getDescription());
        completeMediaDTO.setCoverUrl(media.getCoverUrl());
        completeMediaDTO.setCreatedAt(media.getCreatedAt());
        completeMediaDTO.setUpdatedAt(media.getUpdatedAt());
        if (userMedia.getFlag() != null) {
            completeMediaDTO.setFlag(new FlagDTO(userMedia.getFlag()));
        }
        if (userMedia.getAddedDate() != null) {
            completeMediaDTO.setAddedDate(userMedia.getAddedDate());
        }
        if (media.getMediaType() != null) {
            completeMediaDTO.setMediaType(new MediaTypeDTO(media.getMediaType()));
        }
        if (media.getGenre() != null) {
            completeMediaDTO.setGenre(new GenreDTO(media.getGenre()));
        }
        if (media.getPlatform() != null) {
            completeMediaDTO.setPlatform(new PlatformDTO(media.getPlatform()));
        }
        if (media.getCreatedBy() != null) {
            completeMediaDTO.setCreatedBy(new UserDTO(media.getCreatedBy()));
        }
        if (media.getMediaTagTags() != null) {
            completeMediaDTO.setMediaTagTags(
                media.getMediaTagTags().stream()
                .map(tag -> new TagDTO(tag))
                .toList());
        }
        if (media.getMediaMediaArtists() != null) {
            completeMediaDTO.setMediaMediaArtists(
                media.getMediaMediaArtists().stream()
                .map(artist -> new ArtistDTO(artist.getArtist()))
                .toList());
        }
        if (media.getMediaMediaCollections() != null) {
            completeMediaDTO.setMediaCollections(
                media.getMediaMediaCollections().stream()
                .map(collection -> new CollectionDTO(collection.getCollection()))
                .toList());
            completeMediaDTO.setMediaMediaCollections(
                media.getMediaMediaCollections().stream()
                .map(collection -> new MediaCollectionDTO(collection))
                .toList());
        }
        if (media.getMediaReviews() != null) {
            completeMediaDTO.setMediaReviews(
                media.getMediaReviews().stream()
                .map(review -> new ReviewDTO(review))
                .toList());
        }
        if (isInUserMediaLibrary.length > 0) {
            completeMediaDTO.setInUserMediaLibrary(isInUserMediaLibrary[0]);
        }
        if (userMedia.getId() != null) {
            completeMediaDTO.setUserMediaId(userMedia.getId());
        }
        return completeMediaDTO;
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
