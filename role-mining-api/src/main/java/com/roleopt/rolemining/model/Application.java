package com.roleopt.rolemining.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    private String applicationId;
    
    private String name;
    
    private String description;
    
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private List<Entitlement> entitlements = new ArrayList<>();

    // Default constructor
    public Application() {
    }

    // All-args constructor
    public Application(String applicationId, String name, String description, List<Entitlement> entitlements) {
        this.applicationId = applicationId;
        this.name = name;
        this.description = description;
        this.entitlements = entitlements;
    }

    // Getters and Setters
    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
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

    public List<Entitlement> getEntitlements() {
        return entitlements;
    }

    public void setEntitlements(List<Entitlement> entitlements) {
        this.entitlements = entitlements;
    }

    // equals, hashCode, and toString
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Application that = (Application) o;
        return Objects.equals(applicationId, that.applicationId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(applicationId);
    }

    @Override
    public String toString() {
        return "Application{" +
                "applicationId='" + applicationId + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
} 