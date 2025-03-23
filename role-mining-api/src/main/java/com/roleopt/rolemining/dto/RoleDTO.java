package com.roleopt.rolemining.dto;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class RoleDTO {
    private Long id;
    private String name;
    private int userCount;
    private List<String> applications;
    private int permissionCount;
    private boolean isAiGenerated;
    private int confidence;
    private List<String> users;
    private List<String> permissions;
    private Map<String, Object> attributes = new HashMap<>();
    
    // Default constructor
    public RoleDTO() {
    }
    
    // All-args constructor
    public RoleDTO(Long id, String name, int userCount, List<String> applications, int permissionCount, 
                  boolean aiGenerated, int confidence, List<String> users, List<String> permissions) {
        this.id = id;
        this.name = name;
        this.userCount = userCount;
        this.applications = applications;
        this.permissionCount = permissionCount;
        this.isAiGenerated = aiGenerated;
        this.confidence = confidence;
        this.users = users;
        this.permissions = permissions;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public int getUserCount() {
        return userCount;
    }
    
    public void setUserCount(int userCount) {
        this.userCount = userCount;
    }
    
    public List<String> getApplications() {
        return applications;
    }
    
    public void setApplications(List<String> applications) {
        this.applications = applications;
    }
    
    public int getPermissionCount() {
        return permissionCount;
    }
    
    public void setPermissionCount(int permissionCount) {
        this.permissionCount = permissionCount;
    }
    
    public boolean isAiGenerated() {
        return isAiGenerated;
    }
    
    public void setAiGenerated(boolean aiGenerated) {
        isAiGenerated = aiGenerated;
    }
    
    public int getConfidence() {
        return confidence;
    }
    
    public void setConfidence(int confidence) {
        this.confidence = confidence;
    }
    
    public List<String> getUsers() {
        return users;
    }
    
    public void setUsers(List<String> users) {
        this.users = users;
    }
    
    public List<String> getPermissions() {
        return permissions;
    }
    
    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }
    
    public Map<String, Object> getAttributes() {
        return attributes;
    }
    
    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }
    
    public Object getAttribute(String key) {
        return attributes.get(key);
    }
    
    public void setAttribute(String key, Object value) {
        attributes.put(key, value);
    }
} 