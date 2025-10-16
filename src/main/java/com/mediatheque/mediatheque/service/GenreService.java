package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.Genre;
import com.mediatheque.mediatheque.domain.MediaType;
import com.mediatheque.mediatheque.events.BeforeDeleteGenre;
import com.mediatheque.mediatheque.events.BeforeDeleteMediaType;
import com.mediatheque.mediatheque.model.GenreDTO;
import com.mediatheque.mediatheque.repos.GenreRepository;
import com.mediatheque.mediatheque.repos.MediaTypeRepository;
import com.mediatheque.mediatheque.util.CustomCollectors;
import com.mediatheque.mediatheque.util.NotFoundException;
import com.mediatheque.mediatheque.util.ReferencedException;
import java.util.List;
import java.util.Map;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class GenreService {

    private final GenreRepository genreRepository;
    private final MediaTypeRepository mediaTypeRepository;
    private final ApplicationEventPublisher publisher;

    public GenreService(final GenreRepository genreRepository,
            final MediaTypeRepository mediaTypeRepository,
            final ApplicationEventPublisher publisher) {
        this.genreRepository = genreRepository;
        this.mediaTypeRepository = mediaTypeRepository;
        this.publisher = publisher;
    }

    public List<GenreDTO> findAll() {
        final List<Genre> genres = genreRepository.findAll(Sort.by("id"));
        return genres.stream()
                .map(genre -> mapToDTO(genre, new GenreDTO()))
                .toList();
    }

    public GenreDTO get(final Integer id) {
        return genreRepository.findById(id)
                .map(genre -> mapToDTO(genre, new GenreDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final GenreDTO genreDTO) {
        final Genre genre = new Genre();
        mapToEntity(genreDTO, genre);
        return genreRepository.save(genre).getId();
    }

    public void update(final Integer id, final GenreDTO genreDTO) {
        final Genre genre = genreRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(genreDTO, genre);
        genreRepository.save(genre);
    }

    public void delete(final Integer id) {
        final Genre genre = genreRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        publisher.publishEvent(new BeforeDeleteGenre(id));
        genreRepository.delete(genre);
    }

    private GenreDTO mapToDTO(final Genre genre, final GenreDTO genreDTO) {
        genreDTO.setId(genre.getId());
        genreDTO.setName(genre.getName());
        genreDTO.setMediaType(genre.getMediaType() == null ? null : genre.getMediaType().getId());
        return genreDTO;
    }

    private Genre mapToEntity(final GenreDTO genreDTO, final Genre genre) {
        genre.setName(genreDTO.getName());
        final MediaType mediaType = genreDTO.getMediaType() == null ? null : mediaTypeRepository.findById(genreDTO.getMediaType())
                .orElseThrow(() -> new NotFoundException("mediaType not found"));
        genre.setMediaType(mediaType);
        return genre;
    }

    public Map<Integer, String> getGenreValues() {
        return genreRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Genre::getId, Genre::getName));
    }

    @EventListener(BeforeDeleteMediaType.class)
    public void on(final BeforeDeleteMediaType event) {
        final ReferencedException referencedException = new ReferencedException();
        final Genre mediaTypeGenre = genreRepository.findFirstByMediaTypeId(event.getId());
        if (mediaTypeGenre != null) {
            referencedException.setKey("mediaType.genre.mediaType.referenced");
            referencedException.addParam(mediaTypeGenre.getId());
            throw referencedException;
        }
    }

}
