package com.roleopt.rolemining.dto;

public class DataSummaryDTO {
    private int userCount;
    private int organizationalUnitCount;
    private int applicationCount;
    private int entitlementCount;
    private int assignmentCount;

    // Default constructor
    public DataSummaryDTO() {
    }

    // All-args constructor
    public DataSummaryDTO(int userCount, int organizationalUnitCount, int applicationCount, int entitlementCount, int assignmentCount) {
        this.userCount = userCount;
        this.organizationalUnitCount = organizationalUnitCount;
        this.applicationCount = applicationCount;
        this.entitlementCount = entitlementCount;
        this.assignmentCount = assignmentCount;
    }

    // Getters and Setters
    public int getUserCount() {
        return userCount;
    }

    public void setUserCount(int userCount) {
        this.userCount = userCount;
    }

    public int getOrganizationalUnitCount() {
        return organizationalUnitCount;
    }

    public void setOrganizationalUnitCount(int organizationalUnitCount) {
        this.organizationalUnitCount = organizationalUnitCount;
    }

    public int getApplicationCount() {
        return applicationCount;
    }

    public void setApplicationCount(int applicationCount) {
        this.applicationCount = applicationCount;
    }

    public int getEntitlementCount() {
        return entitlementCount;
    }

    public void setEntitlementCount(int entitlementCount) {
        this.entitlementCount = entitlementCount;
    }

    public int getAssignmentCount() {
        return assignmentCount;
    }

    public void setAssignmentCount(int assignmentCount) {
        this.assignmentCount = assignmentCount;
    }
} 