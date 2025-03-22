package com.roleopt.rolemining.dto;

import javax.validation.constraints.Min;
import java.util.List;

public class RoleMiningFilterDTO {
    private List<String> applications;
    private List<String> organizationalUnits;
    
    @Min(value = 1, message = "Minimum users per role must be at least 1")
    private int minUsersPerRole = 2;
    
    @Min(value = 1, message = "Maximum permissions per role must be at least 1")
    private int maxPermissionsPerRole = 10;
    
    private boolean useAi = true;
    
    // Default constructor
    public RoleMiningFilterDTO() {
    }
    
    // All-args constructor
    public RoleMiningFilterDTO(List<String> applications, List<String> organizationalUnits, 
                              int minUsersPerRole, int maxPermissionsPerRole, boolean useAi) {
        this.applications = applications;
        this.organizationalUnits = organizationalUnits;
        this.minUsersPerRole = minUsersPerRole;
        this.maxPermissionsPerRole = maxPermissionsPerRole;
        this.useAi = useAi;
    }
    
    // Getters and Setters
    public List<String> getApplications() {
        return applications;
    }
    
    public void setApplications(List<String> applications) {
        this.applications = applications;
    }
    
    public List<String> getOrganizationalUnits() {
        return organizationalUnits;
    }
    
    public void setOrganizationalUnits(List<String> organizationalUnits) {
        this.organizationalUnits = organizationalUnits;
    }
    
    public int getMinUsersPerRole() {
        return minUsersPerRole;
    }
    
    public void setMinUsersPerRole(int minUsersPerRole) {
        this.minUsersPerRole = minUsersPerRole;
    }
    
    public int getMaxPermissionsPerRole() {
        return maxPermissionsPerRole;
    }
    
    public void setMaxPermissionsPerRole(int maxPermissionsPerRole) {
        this.maxPermissionsPerRole = maxPermissionsPerRole;
    }
    
    public boolean isUseAi() {
        return useAi;
    }
    
    public void setUseAi(boolean useAi) {
        this.useAi = useAi;
    }
    
    @Override
    public String toString() {
        return "RoleMiningFilterDTO{" +
                "applications=" + applications +
                ", organizationalUnits=" + organizationalUnits +
                ", minUsersPerRole=" + minUsersPerRole +
                ", maxPermissionsPerRole=" + maxPermissionsPerRole +
                ", useAi=" + useAi +
                '}';
    }
} 