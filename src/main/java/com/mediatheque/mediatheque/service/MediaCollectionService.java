package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.Collection;
import com.mediatheque.mediatheque.domain.Media;
import com.mediatheque.mediatheque.domain.MediaCollection;
import com.mediatheque.mediatheque.events.BeforeDeleteCollection;
import com.mediatheque.mediatheque.events.BeforeDeleteMedia;
import com.mediatheque.mediatheque.model.MediaCollectionDTO;
import com.mediatheque.mediatheque.repos.CollectionRepository;
import com.mediatheque.mediatheque.repos.MediaCollectionRepository;
import com.mediatheque.mediatheque.repos.MediaRepository;
import com.mediatheque.mediatheque.util.NotFoundException;
import com.mediatheque.mediatheque.util.ReferencedException;
import java.util.List;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class MediaCollectionService {

    private final MediaCollectionRepository mediaCollectionRepository;
    private final MediaRepository mediaRepository;
    private final CollectionRepository collectionRepository;

    public MediaCollectionService(final MediaCollectionRepository mediaCollectionRepository,
            final MediaRepository mediaRepository,
            final CollectionRepository collectionRepository) {
        this.mediaCollectionRepository = mediaCollectionRepository;
        this.mediaRepository = mediaRepository;
        this.collectionRepository = collectionRepository;
    }

    public List<MediaCollectionDTO> findAll() {
        final List<MediaCollection> mediaCollections = mediaCollectionRepository.findAll(Sort.by("id"));
        return mediaCollections.stream()
                .map(mediaCollection -> mapToDTO(mediaCollection, new MediaCollectionDTO()))
                .toList();
    }

    public MediaCollectionDTO get(final Integer id) {
        return mediaCollectionRepository.findById(id)
                .map(mediaCollection -> mapToDTO(mediaCollection, new MediaCollectionDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final MediaCollectionDTO mediaCollectionDTO) {
        final MediaCollection mediaCollection = new MediaCollection();
        mapToEntity(mediaCollectionDTO, mediaCollection);
        return mediaCollectionRepository.save(mediaCollection).getId();
    }

    public void update(final Integer id, final MediaCollectionDTO mediaCollectionDTO) {
        final MediaCollection mediaCollection = mediaCollectionRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(mediaCollectionDTO, mediaCollection);
        mediaCollectionRepository.save(mediaCollection);
    }

    public void delete(final Integer id) {
        final MediaCollection mediaCollection = mediaCollectionRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mediaCollectionRepository.delete(mediaCollection);
    }

    private MediaCollectionDTO mapToDTO(final MediaCollection mediaCollection,
            final MediaCollectionDTO mediaCollectionDTO) {
        mediaCollectionDTO.setId(mediaCollection.getId());
        mediaCollectionDTO.setPosition(mediaCollection.getPosition());
        mediaCollectionDTO.setType(mediaCollection.getType());
        mediaCollectionDTO.setMedia(mediaCollection.getMedia() == null ? null : mediaCollection.getMedia().getId());
        mediaCollectionDTO.setCollection(mediaCollection.getCollection() == null ? null : mediaCollection.getCollection().getId());
        return mediaCollectionDTO;
    }

    private MediaCollection mapToEntity(final MediaCollectionDTO mediaCollectionDTO,
            final MediaCollection mediaCollection) {
        mediaCollection.setPosition(mediaCollectionDTO.getPosition());
        mediaCollection.setType(mediaCollectionDTO.getType());
        final Media media = mediaCollectionDTO.getMedia() == null ? null : mediaRepository.findById(mediaCollectionDTO.getMedia())
                .orElseThrow(() -> new NotFoundException("media not found"));
        mediaCollection.setMedia(media);
        final Collection collection = mediaCollectionDTO.getCollection() == null ? null : collectionRepository.findById(mediaCollectionDTO.getCollection())
                .orElseThrow(() -> new NotFoundException("collection not found"));
        mediaCollection.setCollection(collection);
        return mediaCollection;
    }

    @EventListener(BeforeDeleteMedia.class)
    public void on(final BeforeDeleteMedia event) {
        final ReferencedException referencedException = new ReferencedException();
        final MediaCollection mediaMediaCollection = mediaCollectionRepository.findFirstByMediaId(event.getId());
        if (mediaMediaCollection != null) {
            referencedException.setKey("media.mediaCollection.media.referenced");
            referencedException.addParam(mediaMediaCollection.getId());
            throw referencedException;
        }
    }

    @EventListener(BeforeDeleteCollection.class)
    public void on(final BeforeDeleteCollection event) {
        final ReferencedException referencedException = new ReferencedException();
        final MediaCollection collectionMediaCollection = mediaCollectionRepository.findFirstByCollectionId(event.getId());
        if (collectionMediaCollection != null) {
            referencedException.setKey("collection.mediaCollection.collection.referenced");
            referencedException.addParam(collectionMediaCollection.getId());
            throw referencedException;
        }
    }

}
