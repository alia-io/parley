package com.syr.parley.service;

import com.syr.parley.domain.Attribute;
import com.syr.parley.repository.AttributeRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AttributeService {

    private final AttributeRepository attributeRepository;

    @Autowired
    public AttributeService(AttributeRepository attributeRepository) {
        this.attributeRepository = attributeRepository;
    }

    public Attribute createAttribute(Attribute attribute) {
        return attributeRepository.save(attribute);
    }

    public Optional<Attribute> getAttributeById(Long id) {
        return attributeRepository.findById(id);
    }

    /**
     * Partial updates given fields of an existing attribute, field will ignore if it is null
     *
     * @param attribute to update.
     * @return updated attribute.
     */
    public Optional<Attribute> updateAttribute(Attribute attribute) {
        return attributeRepository
            .findById(attribute.getId())
            .map(existingAttribute -> {
                if (attribute.getAttributeName() != null) {
                    existingAttribute.setAttributeName(attribute.getAttributeName());
                }
                if (attribute.getDescription() != null) {
                    existingAttribute.setDescription(attribute.getDescription());
                }

                return existingAttribute;
            })
            .map(attributeRepository::save);
    }

    public List<Attribute> getAllAttributes() {
        return attributeRepository.findAll();
    }

    public void deleteAttribute(Long id) {
        attributeRepository.deleteById(id);
    }
}
