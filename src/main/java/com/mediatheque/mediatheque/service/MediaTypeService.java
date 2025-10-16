package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.MediaType;
import com.mediatheque.mediatheque.events.BeforeDeleteMediaType;
import com.mediatheque.mediatheque.model.MediaTypeDTO;
import com.mediatheque.mediatheque.repos.MediaTypeRepository;
import com.mediatheque.mediatheque.util.CustomCollectors;
import com.mediatheque.mediatheque.util.NotFoundException;
import java.util.List;
import java.util.Map;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class MediaTypeService {

    private final MediaTypeRepository mediaTypeRepository;
    private final ApplicationEventPublisher publisher;

    public MediaTypeService(final MediaTypeRepository mediaTypeRepository,
            final ApplicationEventPublisher publisher) {
        this.mediaTypeRepository = mediaTypeRepository;
        this.publisher = publisher;
    }

    public List<MediaTypeDTO> findAll() {
        final List<MediaType> mediaTypes = mediaTypeRepository.findAll(Sort.by("id"));
        return mediaTypes.stream()
                .map(mediaType -> mapToDTO(mediaType, new MediaTypeDTO()))
                .toList();
    }

    public MediaTypeDTO get(final Integer id) {
        return mediaTypeRepository.findById(id)
                .map(mediaType -> mapToDTO(mediaType, new MediaTypeDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final MediaTypeDTO mediaTypeDTO) {
        final MediaType mediaType = new MediaType();
        mapToEntity(mediaTypeDTO, mediaType);
        return mediaTypeRepository.save(mediaType).getId();
    }

    public void update(final Integer id, final MediaTypeDTO mediaTypeDTO) {
        final MediaType mediaType = mediaTypeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(mediaTypeDTO, mediaType);
        mediaTypeRepository.save(mediaType);
    }

    public void delete(final Integer id) {
        final MediaType mediaType = mediaTypeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        publisher.publishEvent(new BeforeDeleteMediaType(id));
        mediaTypeRepository.delete(mediaType);
    }

    private MediaTypeDTO mapToDTO(final MediaType mediaType, final MediaTypeDTO mediaTypeDTO) {
        mediaTypeDTO.setId(mediaType.getId());
        mediaTypeDTO.setName(mediaType.getName());
        return mediaTypeDTO;
    }

    private MediaType mapToEntity(final MediaTypeDTO mediaTypeDTO, final MediaType mediaType) {
        mediaType.setName(mediaTypeDTO.getName());
        return mediaType;
    }

    public Map<Integer, String> getMediaTypeValues() {
        return mediaTypeRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(MediaType::getId, MediaType::getName));
    }

}
