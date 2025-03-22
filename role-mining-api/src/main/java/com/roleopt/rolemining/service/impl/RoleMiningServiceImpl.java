package com.roleopt.rolemining.service.impl;

import com.roleopt.rolemining.dto.RoleDTO;
import com.roleopt.rolemining.dto.RoleMiningFilterDTO;
import com.roleopt.rolemining.model.Application;
import com.roleopt.rolemining.model.Entitlement;
import com.roleopt.rolemining.model.Role;
import com.roleopt.rolemining.model.User;
import com.roleopt.rolemining.service.RoleMiningService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoleMiningServiceImpl implements RoleMiningService {

    private static final Logger log = LoggerFactory.getLogger(RoleMiningServiceImpl.class);

    // For this demonstration, we'll use in-memory collections
    private List<RoleDTO> latestResults = new ArrayList<>();
    private List<RoleDTO> aiSuggestions = new ArrayList<>();

    @Override
    @Transactional
    public List<RoleDTO> mineRoles(RoleMiningFilterDTO filters) {
        log.info("Mining roles with filters: {}", filters);
        
        // In a real implementation, this would perform actual role mining logic
        // For this demonstration, we'll return mock data
        List<RoleDTO> roles = generateMockRoles(filters);
        
        // Store the results
        this.latestResults = roles;
        
        // Generate AI suggestions if requested
        if (filters.isUseAi()) {
            this.aiSuggestions = generateMockAiSuggestions();
        }
        
        return roles;
    }

    @Override
    public List<RoleDTO> getLatestResults() {
        return latestResults;
    }

    @Override
    public List<RoleDTO> getAiSuggestions() {
        return aiSuggestions;
    }

    @Override
    public Resource generateReport() {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        try (Writer writer = new OutputStreamWriter(outputStream, StandardCharsets.UTF_8);
             CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT
                     .withHeader("Role ID", "Role Name", "User Count", "Applications", "Permission Count", "AI Generated", "Confidence"))) {
            
            // Add manual roles
            for (RoleDTO role : latestResults) {
                csvPrinter.printRecord(
                        role.getId(),
                        role.getName(),
                        role.getUserCount(),
                        String.join(", ", role.getApplications()),
                        role.getPermissionCount(),
                        "No",
                        "-"
                );
            }
            
            // Add AI-suggested roles
            for (RoleDTO role : aiSuggestions) {
                csvPrinter.printRecord(
                        role.getId(),
                        role.getName(),
                        role.getUserCount(),
                        String.join(", ", role.getApplications()),
                        role.getPermissionCount(),
                        "Yes",
                        role.getConfidence() + "%"
                );
            }
            
            csvPrinter.flush();
        } catch (IOException e) {
            log.error("Error generating CSV report", e);
        }
        
        return new ByteArrayResource(outputStream.toByteArray());
    }

    private List<RoleDTO> generateMockRoles(RoleMiningFilterDTO filters) {
        // Generate 3-6 mock roles based on the filter criteria
        int roleCount = new Random().nextInt(4) + 3;
        List<RoleDTO> roles = new ArrayList<>();
        
        for (int i = 1; i <= roleCount; i++) {
            RoleDTO role = new RoleDTO();
            role.setId((long) i);
            role.setName("Role " + i);
            
            // User count between minUsersPerRole and minUsersPerRole+20
            role.setUserCount(filters.getMinUsersPerRole() + new Random().nextInt(20));
            
            // Applications (2-4)
            int appCount = new Random().nextInt(3) + 2;
            List<String> apps = new ArrayList<>();
            for (int j = 1; j <= appCount; j++) {
                apps.add("App" + j);
            }
            role.setApplications(apps);
            
            // Permission count between 1 and maxPermissionsPerRole
            role.setPermissionCount(1 + new Random().nextInt(filters.getMaxPermissionsPerRole()));
            
            // Not AI generated
            role.setAiGenerated(false);
            role.setConfidence(0);
            
            // Mock users and permissions
            List<String> users = new ArrayList<>();
            for (int j = 1; j <= role.getUserCount(); j++) {
                users.add("User" + j);
            }
            role.setUsers(users);
            
            List<String> permissions = new ArrayList<>();
            for (int j = 1; j <= role.getPermissionCount(); j++) {
                permissions.add("Permission" + j);
            }
            role.setPermissions(permissions);
            
            roles.add(role);
        }
        
        return roles;
    }

    private List<RoleDTO> generateMockAiSuggestions() {
        // Generate 2-4 mock AI-suggested roles
        int roleCount = new Random().nextInt(3) + 2;
        List<RoleDTO> roles = new ArrayList<>();
        
        for (int i = 1; i <= roleCount; i++) {
            RoleDTO role = new RoleDTO();
            role.setId((long) (100 + i)); // IDs starting at 101 for AI roles
            role.setName("AI Role " + i);
            
            // User count (5-25)
            role.setUserCount(5 + new Random().nextInt(20));
            
            // Applications (2-4)
            int appCount = new Random().nextInt(3) + 2;
            List<String> apps = new ArrayList<>();
            for (int j = 1; j <= appCount; j++) {
                apps.add("App" + j);
            }
            role.setApplications(apps);
            
            // Permission count (2-10)
            role.setPermissionCount(2 + new Random().nextInt(8));
            
            // AI generated with confidence (70-95%)
            role.setAiGenerated(true);
            role.setConfidence(70 + new Random().nextInt(25));
            
            // Mock users and permissions
            List<String> users = new ArrayList<>();
            for (int j = 1; j <= role.getUserCount(); j++) {
                users.add("User" + j);
            }
            role.setUsers(users);
            
            List<String> permissions = new ArrayList<>();
            for (int j = 1; j <= role.getPermissionCount(); j++) {
                permissions.add("Permission" + j);
            }
            role.setPermissions(permissions);
            
            roles.add(role);
        }
        
        return roles;
    }
} 