package com.roleopt.rolemining.service.impl;

import com.roleopt.rolemining.dto.DataSummaryDTO;
import com.roleopt.rolemining.model.*;
import com.roleopt.rolemining.service.UploadService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class UploadServiceImpl implements UploadService {

    private static final Logger log = LoggerFactory.getLogger(UploadServiceImpl.class);

    // For this demonstration, we'll use in-memory collections
    private final Map<String, OrganizationalUnit> organizationalUnits = new HashMap<>();
    private final Map<String, User> users = new HashMap<>();
    private final Map<String, Application> applications = new HashMap<>();
    private final Map<String, Entitlement> entitlements = new HashMap<>();
    private final List<Assignment> assignments = new ArrayList<>();
    
    private final RoleMiningServiceImpl roleMiningService;
    
    public UploadServiceImpl(RoleMiningServiceImpl roleMiningService) {
        this.roleMiningService = roleMiningService;
    }

    @Override
    public void processFiles(MultipartFile usersFile, MultipartFile ouFile, 
                           MultipartFile applicationsFile, MultipartFile entitlementsFile,
                           MultipartFile assignmentsFile) throws Exception {
        
        // Clear previous data
        organizationalUnits.clear();
        users.clear();
        applications.clear();
        entitlements.clear();
        assignments.clear();
        
        // Process Organizational Units
        if (ouFile != null && !ouFile.isEmpty()) {
            processOUs(ouFile);
        }
        
        // Process Users
        if (usersFile != null && !usersFile.isEmpty()) {
            processUsers(usersFile);
        }
        
        // Process Applications
        if (applicationsFile != null && !applicationsFile.isEmpty()) {
            processApplications(applicationsFile);
        }
        
        // Process Entitlements
        if (entitlementsFile != null && !entitlementsFile.isEmpty()) {
            processEntitlements(entitlementsFile);
        }
        
        // Process Access Assignments
        if (assignmentsFile != null && !assignmentsFile.isEmpty()) {
            processAssignments(assignmentsFile);
        }
        
        // Share the data with RoleMiningService
        roleMiningService.setDataSources(
            new HashMap<>(users),
            new HashMap<>(organizationalUnits),
            new HashMap<>(applications),
            new HashMap<>(entitlements),
            new ArrayList<>(assignments)
        );
        
        log.info("Finished processing all files. Entities loaded: {} OUs, {} users, {} applications, {} entitlements, {} assignments",
            organizationalUnits.size(), users.size(), applications.size(), entitlements.size(), assignments.size());
    }

    @Override
    public DataSummaryDTO getDataSummary() {
        DataSummaryDTO dataSummaryDTO = new DataSummaryDTO();
        dataSummaryDTO.setUserCount(users.size());
        dataSummaryDTO.setOrganizationalUnitCount(organizationalUnits.size());
        dataSummaryDTO.setApplicationCount(applications.size());
        dataSummaryDTO.setEntitlementCount(entitlements.size());
        dataSummaryDTO.setAssignmentCount(assignments.size());
        return dataSummaryDTO;
    }

    private void processOUs(MultipartFile file) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {
            
            for (CSVRecord record : csvParser) {
                OrganizationalUnit ou = new OrganizationalUnit();
                ou.setOuId(record.get("ouId"));
                ou.setName(record.get("name"));
                ou.setDescription(record.get("description"));
                ou.setUsers(new ArrayList<User>());
                
                organizationalUnits.put(ou.getOuId(), ou);
            }
        }
    }

    private void processUsers(MultipartFile file) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {
            
            for (CSVRecord record : csvParser) {
                User user = new User();
                user.setUserId(record.get("userId"));
                user.setFirstName(record.get("firstName"));
                user.setLastName(record.get("lastName"));
                
                String ouId = record.get("ouId");
                OrganizationalUnit ou = organizationalUnits.get(ouId);
                if (ou != null) {
                    user.setOrganizationalUnit(ou);
                    ou.getUsers().add(user);
                }
                
                users.put(user.getUserId(), user);
            }
        }
    }

    private void processApplications(MultipartFile file) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {
            
            for (CSVRecord record : csvParser) {
                Application app = new Application();
                app.setApplicationId(record.get("applicationId"));
                app.setName(record.get("name"));
                app.setDescription(record.get("description"));
                app.setEntitlements(new ArrayList<Entitlement>());
                
                applications.put(app.getApplicationId(), app);
            }
        }
    }

    private void processEntitlements(MultipartFile file) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {
            
            for (CSVRecord record : csvParser) {
                Entitlement entitlement = new Entitlement();
                entitlement.setEntitlementId(record.get("entitlementId"));
                entitlement.setName(record.get("name"));
                entitlement.setDescription(record.get("description"));
                
                String applicationId = record.get("applicationId");
                Application app = applications.get(applicationId);
                if (app != null) {
                    entitlement.setApplication(app);
                    app.getEntitlements().add(entitlement);
                }
                
                entitlements.put(entitlement.getEntitlementId(), entitlement);
            }
        }
    }

    private void processAssignments(MultipartFile file) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {
            
            // Group assignments by userId
            Map<String, List<String>> userAssignments = new HashMap<>();
            
            for (CSVRecord record : csvParser) {
                String userId = record.get("userId");
                String entitlementId = record.get("entitlementId");
                
                userAssignments.computeIfAbsent(userId, k -> new ArrayList<>()).add(entitlementId);
            }
            
            // Create assignment objects
            long assignmentId = 1;
            for (Map.Entry<String, List<String>> entry : userAssignments.entrySet()) {
                String userId = entry.getKey();
                List<String> entitlementIds = entry.getValue();
                
                User user = users.get(userId);
                if (user == null) continue;
                
                Assignment assignment = new Assignment();
                assignment.setId(assignmentId++);
                assignment.setUser(user);
                assignment.setEntitlements(new ArrayList<Entitlement>());
                
                for (String entitlementId : entitlementIds) {
                    Entitlement entitlement = entitlements.get(entitlementId);
                    if (entitlement != null) {
                        assignment.getEntitlements().add(entitlement);
                    }
                }
                
                assignments.add(assignment);
            }
        }
    }
} 