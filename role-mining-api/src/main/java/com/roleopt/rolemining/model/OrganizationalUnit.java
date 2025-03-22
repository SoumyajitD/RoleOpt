package com.roleopt.rolemining.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "organizational_units")
public class OrganizationalUnit {

    @Id
    private String ouId;
    
    private String name;
    
    private String description;
    
    @OneToMany(mappedBy = "organizationalUnit", cascade = CascadeType.ALL)
    private List<User> users = new ArrayList<>();

    // Default constructor
    public OrganizationalUnit() {
    }

    // All-args constructor
    public OrganizationalUnit(String ouId, String name, String description, List<User> users) {
        this.ouId = ouId;
        this.name = name;
        this.description = description;
        this.users = users;
    }

    // Getters and Setters
    public String getOuId() {
        return ouId;
    }

    public void setOuId(String ouId) {
        this.ouId = ouId;
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

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    // equals, hashCode, and toString
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrganizationalUnit that = (OrganizationalUnit) o;
        return Objects.equals(ouId, that.ouId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ouId);
    }

    @Override
    public String toString() {
        return "OrganizationalUnit{" +
                "ouId='" + ouId + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", users=" + users +
                '}';
    }
} 