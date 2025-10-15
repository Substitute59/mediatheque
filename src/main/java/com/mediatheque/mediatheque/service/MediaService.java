package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.Media;
import com.mediatheque.mediatheque.model.MediaDTO;
import com.mediatheque.mediatheque.repos.MediaRepository;
import com.mediatheque.mediatheque.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class MediaService {

    private final MediaRepository mediaRepository;

    public MediaService(final MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    public List<MediaDTO> findAll() {
        final List<Media> medias = mediaRepository.findAll(Sort.by("id"));
        return medias.stream()
                .map(media -> mapToDTO(media, new MediaDTO()))
                .toList();
    }

    public MediaDTO get(final Long id) {
        return mediaRepository.findById(id)
                .map(media -> mapToDTO(media, new MediaDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final MediaDTO mediaDTO) {
        final Media media = new Media();
        mapToEntity(mediaDTO, media);
        return mediaRepository.save(media).getId();
    }

    public void update(final Long id, final MediaDTO mediaDTO) {
        final Media media = mediaRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(mediaDTO, media);
        mediaRepository.save(media);
    }

    public void delete(final Long id) {
        final Media media = mediaRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mediaRepository.delete(media);
    }

    private MediaDTO mapToDTO(final Media media, final MediaDTO mediaDTO) {
        mediaDTO.setId(media.getId());
        mediaDTO.setTitle(media.getTitle());
        mediaDTO.setType(media.getType());
        return mediaDTO;
    }

    private Media mapToEntity(final MediaDTO mediaDTO, final Media media) {
        media.setTitle(mediaDTO.getTitle());
        media.setType(mediaDTO.getType());
        return media;
    }

}
