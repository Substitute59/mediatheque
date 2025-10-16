package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.Artist;
import com.mediatheque.mediatheque.events.BeforeDeleteArtist;
import com.mediatheque.mediatheque.model.ArtistDTO;
import com.mediatheque.mediatheque.repos.ArtistRepository;
import com.mediatheque.mediatheque.util.CustomCollectors;
import com.mediatheque.mediatheque.util.NotFoundException;
import java.util.List;
import java.util.Map;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ArtistService {

    private final ArtistRepository artistRepository;
    private final ApplicationEventPublisher publisher;

    public ArtistService(final ArtistRepository artistRepository,
            final ApplicationEventPublisher publisher) {
        this.artistRepository = artistRepository;
        this.publisher = publisher;
    }

    public List<ArtistDTO> findAll() {
        final List<Artist> artists = artistRepository.findAll(Sort.by("id"));
        return artists.stream()
                .map(artist -> mapToDTO(artist, new ArtistDTO()))
                .toList();
    }

    public ArtistDTO get(final Integer id) {
        return artistRepository.findById(id)
                .map(artist -> mapToDTO(artist, new ArtistDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final ArtistDTO artistDTO) {
        final Artist artist = new Artist();
        mapToEntity(artistDTO, artist);
        return artistRepository.save(artist).getId();
    }

    public void update(final Integer id, final ArtistDTO artistDTO) {
        final Artist artist = artistRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(artistDTO, artist);
        artistRepository.save(artist);
    }

    public void delete(final Integer id) {
        final Artist artist = artistRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        publisher.publishEvent(new BeforeDeleteArtist(id));
        artistRepository.delete(artist);
    }

    private ArtistDTO mapToDTO(final Artist artist, final ArtistDTO artistDTO) {
        artistDTO.setId(artist.getId());
        artistDTO.setName(artist.getName());
        artistDTO.setType(artist.getType());
        return artistDTO;
    }

    private Artist mapToEntity(final ArtistDTO artistDTO, final Artist artist) {
        artist.setName(artistDTO.getName());
        artist.setType(artistDTO.getType());
        return artist;
    }

    public Map<Integer, String> getArtistValues() {
        return artistRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Artist::getId, Artist::getName));
    }

}
