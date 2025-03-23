package com.roleopt.rolemining.dto;

public class OrganizationalUnitDTO {
    private String id;
    private String name;
    private String description;
    
    // Default constructor
    public OrganizationalUnitDTO() {
    }
    
    // All-args constructor
    public OrganizationalUnitDTO(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
} 