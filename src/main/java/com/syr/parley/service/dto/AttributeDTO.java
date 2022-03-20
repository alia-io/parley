package com.syr.parley.service.dto;

import lombok.Data;

@Data
public class AttributeDTO {

    private long id;
    private String attributeName;
    private String description;

    public AttributeDTO() {}

    public AttributeDTO(long id, String attributeName, String description) {
        this.id = id;
        this.attributeName = attributeName;
        this.description = description;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
