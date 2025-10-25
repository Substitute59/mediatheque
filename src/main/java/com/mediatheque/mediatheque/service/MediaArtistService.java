package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.Artist;
import com.mediatheque.mediatheque.domain.Media;
import com.mediatheque.mediatheque.domain.MediaArtist;
import com.mediatheque.mediatheque.events.BeforeDeleteArtist;
import com.mediatheque.mediatheque.events.BeforeDeleteMedia;
import com.mediatheque.mediatheque.model.MediaArtistDTO;
import com.mediatheque.mediatheque.repos.ArtistRepository;
import com.mediatheque.mediatheque.repos.MediaArtistRepository;
import com.mediatheque.mediatheque.repos.MediaRepository;
import com.mediatheque.mediatheque.util.NotFoundException;
import com.mediatheque.mediatheque.util.ReferencedException;
import java.util.List;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class MediaArtistService {

    private final MediaArtistRepository mediaArtistRepository;
    private final MediaRepository mediaRepository;
    private final ArtistRepository artistRepository;

    public MediaArtistService(final MediaArtistRepository mediaArtistRepository,
            final MediaRepository mediaRepository, final ArtistRepository artistRepository) {
        this.mediaArtistRepository = mediaArtistRepository;
        this.mediaRepository = mediaRepository;
        this.artistRepository = artistRepository;
    }

    public List<MediaArtistDTO> findAll() {
        final List<MediaArtist> mediaArtists = mediaArtistRepository.findAll(Sort.by("id"));
        return mediaArtists.stream()
                .map(mediaArtist -> mapToDTO(mediaArtist, new MediaArtistDTO()))
                .toList();
    }

    public MediaArtistDTO get(final Integer id) {
        return mediaArtistRepository.findById(id)
                .map(mediaArtist -> mapToDTO(mediaArtist, new MediaArtistDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final MediaArtistDTO mediaArtistDTO) {
        final MediaArtist mediaArtist = new MediaArtist();
        mapToEntity(mediaArtistDTO, mediaArtist);
        return mediaArtistRepository.save(mediaArtist).getId();
    }

    public void update(final Integer id, final MediaArtistDTO mediaArtistDTO) {
        final MediaArtist mediaArtist = mediaArtistRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(mediaArtistDTO, mediaArtist);
        mediaArtistRepository.save(mediaArtist);
    }

    public void delete(final Integer id) {
        final MediaArtist mediaArtist = mediaArtistRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mediaArtistRepository.delete(mediaArtist);
    }

    private MediaArtistDTO mapToDTO(final MediaArtist mediaArtist,
            final MediaArtistDTO mediaArtistDTO) {
        mediaArtistDTO.setId(mediaArtist.getId());
        mediaArtistDTO.setMedia(mediaArtist.getMedia() == null ? null : mediaArtist.getMedia().getId());
        mediaArtistDTO.setArtist(mediaArtist.getArtist() == null ? null : mediaArtist.getArtist().getId());
        return mediaArtistDTO;
    }

    private MediaArtist mapToEntity(final MediaArtistDTO mediaArtistDTO,
            final MediaArtist mediaArtist) {
        final Media media = mediaArtistDTO.getMedia() == null ? null : mediaRepository.findById(mediaArtistDTO.getMedia())
                .orElseThrow(() -> new NotFoundException("media not found"));
        mediaArtist.setMedia(media);
        final Artist artist = mediaArtistDTO.getArtist() == null ? null : artistRepository.findById(mediaArtistDTO.getArtist())
                .orElseThrow(() -> new NotFoundException("artist not found"));
        mediaArtist.setArtist(artist);
        return mediaArtist;
    }

    @EventListener(BeforeDeleteMedia.class)
    public void on(final BeforeDeleteMedia event) {
        final ReferencedException referencedException = new ReferencedException();
        final MediaArtist mediaMediaArtist = mediaArtistRepository.findFirstByMediaId(event.getId());
        if (mediaMediaArtist != null) {
            referencedException.setKey("media.mediaArtist.media.referenced");
            referencedException.addParam(mediaMediaArtist.getId());
            throw referencedException;
        }
    }

    @EventListener(BeforeDeleteArtist.class)
    public void on(final BeforeDeleteArtist event) {
        final ReferencedException referencedException = new ReferencedException();
        final MediaArtist artistMediaArtist = mediaArtistRepository.findFirstByArtistId(event.getId());
        if (artistMediaArtist != null) {
            referencedException.setKey("artist.mediaArtist.artist.referenced");
            referencedException.addParam(artistMediaArtist.getId());
            throw referencedException;
        }
    }

}
