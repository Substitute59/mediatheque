package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.Collection;
import com.mediatheque.mediatheque.events.BeforeDeleteCollection;
import com.mediatheque.mediatheque.model.CollectionDTO;
import com.mediatheque.mediatheque.repos.CollectionRepository;
import com.mediatheque.mediatheque.util.CustomCollectors;
import com.mediatheque.mediatheque.util.NotFoundException;
import java.util.List;
import java.util.Map;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final ApplicationEventPublisher publisher;

    public CollectionService(final CollectionRepository collectionRepository,
            final ApplicationEventPublisher publisher) {
        this.collectionRepository = collectionRepository;
        this.publisher = publisher;
    }

    public List<CollectionDTO> findAll() {
        final List<Collection> collections = collectionRepository.findAll(Sort.by("id"));
        return collections.stream()
                .map(collection -> mapToDTO(collection, new CollectionDTO()))
                .toList();
    }

    public CollectionDTO get(final Integer id) {
        return collectionRepository.findById(id)
                .map(collection -> mapToDTO(collection, new CollectionDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final CollectionDTO collectionDTO) {
        final Collection collection = new Collection();
        mapToEntity(collectionDTO, collection);
        return collectionRepository.save(collection).getId();
    }

    public void update(final Integer id, final CollectionDTO collectionDTO) {
        final Collection collection = collectionRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(collectionDTO, collection);
        collectionRepository.save(collection);
    }

    public void delete(final Integer id) {
        final Collection collection = collectionRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        publisher.publishEvent(new BeforeDeleteCollection(id));
        collectionRepository.delete(collection);
    }

    private CollectionDTO mapToDTO(final Collection collection, final CollectionDTO collectionDTO) {
        collectionDTO.setId(collection.getId());
        collectionDTO.setName(collection.getName());
        return collectionDTO;
    }

    private Collection mapToEntity(final CollectionDTO collectionDTO, final Collection collection) {
        collection.setName(collectionDTO.getName());
        return collection;
    }

    public Map<Integer, String> getCollectionValues() {
        return collectionRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Collection::getId, Collection::getName));
    }

}
