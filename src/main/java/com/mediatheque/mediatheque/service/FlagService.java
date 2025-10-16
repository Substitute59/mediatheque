package com.mediatheque.mediatheque.service;

import com.mediatheque.mediatheque.domain.Flag;
import com.mediatheque.mediatheque.events.BeforeDeleteFlag;
import com.mediatheque.mediatheque.model.FlagDTO;
import com.mediatheque.mediatheque.repos.FlagRepository;
import com.mediatheque.mediatheque.util.CustomCollectors;
import com.mediatheque.mediatheque.util.NotFoundException;
import java.util.List;
import java.util.Map;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class FlagService {

    private final FlagRepository flagRepository;
    private final ApplicationEventPublisher publisher;

    public FlagService(final FlagRepository flagRepository,
            final ApplicationEventPublisher publisher) {
        this.flagRepository = flagRepository;
        this.publisher = publisher;
    }

    public List<FlagDTO> findAll() {
        final List<Flag> flags = flagRepository.findAll(Sort.by("id"));
        return flags.stream()
                .map(flag -> mapToDTO(flag, new FlagDTO()))
                .toList();
    }

    public FlagDTO get(final Integer id) {
        return flagRepository.findById(id)
                .map(flag -> mapToDTO(flag, new FlagDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final FlagDTO flagDTO) {
        final Flag flag = new Flag();
        mapToEntity(flagDTO, flag);
        return flagRepository.save(flag).getId();
    }

    public void update(final Integer id, final FlagDTO flagDTO) {
        final Flag flag = flagRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(flagDTO, flag);
        flagRepository.save(flag);
    }

    public void delete(final Integer id) {
        final Flag flag = flagRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        publisher.publishEvent(new BeforeDeleteFlag(id));
        flagRepository.delete(flag);
    }

    private FlagDTO mapToDTO(final Flag flag, final FlagDTO flagDTO) {
        flagDTO.setId(flag.getId());
        flagDTO.setName(flag.getName());
        flagDTO.setColor(flag.getColor());
        return flagDTO;
    }

    private Flag mapToEntity(final FlagDTO flagDTO, final Flag flag) {
        flag.setName(flagDTO.getName());
        flag.setColor(flagDTO.getColor());
        return flag;
    }

    public Map<Integer, String> getFlagValues() {
        return flagRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Flag::getId, Flag::getName));
    }

}
