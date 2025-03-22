package com.roleopt.rolemining.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

@Entity
@Table(name = "entitlements")
public class Entitlement {

    @Id
    private String entitlementId;
    
    private String name;
    
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;
    
    @ManyToMany(mappedBy = "entitlements")
    private Set<Role> roles = new HashSet<>();
    
    @ManyToMany(mappedBy = "entitlements")
    private Set<Assignment> assignments = new HashSet<>();

    // Default constructor
    public Entitlement() {
    }

    // All-args constructor
    public Entitlement(String entitlementId, String name, String description, Application application, Set<Role> roles, Set<Assignment> assignments) {
        this.entitlementId = entitlementId;
        this.name = name;
        this.description = description;
        this.application = application;
        this.roles = roles;
        this.assignments = assignments;
    }

    // Getters and Setters
    public String getEntitlementId() {
        return entitlementId;
    }

    public void setEntitlementId(String entitlementId) {
        this.entitlementId = entitlementId;
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

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Set<Assignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(Set<Assignment> assignments) {
        this.assignments = assignments;
    }

    // equals, hashCode, and toString
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Entitlement that = (Entitlement) o;
        return Objects.equals(entitlementId, that.entitlementId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(entitlementId);
    }

    @Override
    public String toString() {
        return "Entitlement{" +
                "entitlementId='" + entitlementId + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", application=" + (application != null ? application.getApplicationId() : null) +
                '}';
    }
} 