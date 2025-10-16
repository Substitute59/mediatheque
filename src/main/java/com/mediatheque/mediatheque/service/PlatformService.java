package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.Platform;
import com.mediatheque.mediatheque.events.BeforeDeletePlatform;
import com.mediatheque.mediatheque.model.PlatformDTO;
import com.mediatheque.mediatheque.repos.PlatformRepository;
import com.mediatheque.mediatheque.util.CustomCollectors;
import com.mediatheque.mediatheque.util.NotFoundException;
import java.util.List;
import java.util.Map;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class PlatformService {

    private final PlatformRepository platformRepository;
    private final ApplicationEventPublisher publisher;

    public PlatformService(final PlatformRepository platformRepository,
            final ApplicationEventPublisher publisher) {
        this.platformRepository = platformRepository;
        this.publisher = publisher;
    }

    public List<PlatformDTO> findAll() {
        final List<Platform> platforms = platformRepository.findAll(Sort.by("id"));
        return platforms.stream()
                .map(platform -> mapToDTO(platform, new PlatformDTO()))
                .toList();
    }

    public PlatformDTO get(final Integer id) {
        return platformRepository.findById(id)
                .map(platform -> mapToDTO(platform, new PlatformDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final PlatformDTO platformDTO) {
        final Platform platform = new Platform();
        mapToEntity(platformDTO, platform);
        return platformRepository.save(platform).getId();
    }

    public void update(final Integer id, final PlatformDTO platformDTO) {
        final Platform platform = platformRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(platformDTO, platform);
        platformRepository.save(platform);
    }

    public void delete(final Integer id) {
        final Platform platform = platformRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        publisher.publishEvent(new BeforeDeletePlatform(id));
        platformRepository.delete(platform);
    }

    private PlatformDTO mapToDTO(final Platform platform, final PlatformDTO platformDTO) {
        platformDTO.setId(platform.getId());
        platformDTO.setName(platform.getName());
        return platformDTO;
    }

    private Platform mapToEntity(final PlatformDTO platformDTO, final Platform platform) {
        platform.setName(platformDTO.getName());
        return platform;
    }

    public Map<Integer, String> getPlatformValues() {
        return platformRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Platform::getId, Platform::getName));
    }

}
