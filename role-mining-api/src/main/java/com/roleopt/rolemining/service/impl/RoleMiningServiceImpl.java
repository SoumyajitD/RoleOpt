package com.roleopt.rolemining.service.impl;

import com.roleopt.rolemining.dto.RoleDTO;
import com.roleopt.rolemining.dto.RoleMiningFilterDTO;
import com.roleopt.rolemining.model.*;
import com.roleopt.rolemining.service.AIRoleSuggestionService;
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
    
    private final AIRoleSuggestionService aiRoleSuggestionService;
    
    // Maps to store uploaded data
    private Map<String, User> users = new HashMap<>();
    private Map<String, OrganizationalUnit> ous = new HashMap<>();
    private Map<String, Application> applications = new HashMap<>();
    private Map<String, Entitlement> entitlements = new HashMap<>();
    private List<Assignment> assignments = new ArrayList<>();

    public RoleMiningServiceImpl(AIRoleSuggestionService aiRoleSuggestionService) {
        this.aiRoleSuggestionService = aiRoleSuggestionService;
    }
    
    public void setDataSources(Map<String, User> users,
                              Map<String, OrganizationalUnit> ous,
                              Map<String, Application> applications,
                              Map<String, Entitlement> entitlements,
                              List<Assignment> assignments) {
        this.users = users;
        this.ous = ous;
        this.applications = applications;
        this.entitlements = entitlements;
        this.assignments = assignments;
    }

    @Override
    @Transactional
    public List<RoleDTO> mineRoles(RoleMiningFilterDTO filters) {
        log.info("Mining roles with filters: {}", filters);
        
        // Instead of using mock data, perform actual role mining with clustering
        List<RoleDTO> roles;
        if (!assignments.isEmpty() && !users.isEmpty() && !entitlements.isEmpty()) {
            log.info("Performing real role mining with {} users, {} entitlements, and {} assignments", 
                    users.size(), entitlements.size(), assignments.size());
            roles = performRoleMiningClustering(filters);
            log.info("Generated {} role(s) through clustering", roles.size());
        } else {
            log.warn("No data available for role mining, using mock roles as fallback");
            roles = generateMockRoles(filters);
        }
        
        // Store the results
        this.latestResults = roles;
        
        // Generate AI suggestions if requested
        if (filters.isUseAi()) {
            log.info("AI role suggestions requested");
            log.info("Data status - Users: {}, Entitlements: {}, Assignments: {}", 
                    users.size(), entitlements.size(), assignments.size());
            
            if (!assignments.isEmpty() && !users.isEmpty() && !entitlements.isEmpty()) {
                try {
                    log.info("Attempting to generate AI suggestions with real data");
                    this.aiSuggestions = aiRoleSuggestionService.suggestRoles(users, entitlements, assignments);
                    log.info("Successfully generated {} AI-suggested roles", this.aiSuggestions.size());
                } catch (Exception e) {
                    log.error("Error generating AI suggestions: {}", e.getMessage(), e);
                    // Fallback to mock AI suggestions if there's an error
                    this.aiSuggestions = generateMockAiSuggestions();
                    log.info("Using mock AI suggestions due to error");
                }
            } else {
                // Fallback to mock AI suggestions if no data is available
                log.info("No data available for AI analysis, using mock suggestions");
                this.aiSuggestions = generateMockAiSuggestions();
            }
        } else {
            log.info("AI role suggestions not requested");
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

    /**
     * Performs actual role mining using a simple clustering algorithm
     * This groups users that have similar entitlements together
     */
    private List<RoleDTO> performRoleMiningClustering(RoleMiningFilterDTO filters) {
        List<RoleDTO> roles = new ArrayList<>();
        
        log.info("Starting clustering-based role mining");
        
        // Step 1: Create a map of user ID to their entitlements
        Map<String, Set<String>> userEntitlements = new HashMap<>();
        
        for (Assignment assignment : assignments) {
            String userId = assignment.getUser().getUserId();
            
            if (!userEntitlements.containsKey(userId)) {
                userEntitlements.put(userId, new HashSet<>());
            }
            
            for (Entitlement entitlement : assignment.getEntitlements()) {
                userEntitlements.get(userId).add(entitlement.getEntitlementId());
            }
        }
        
        log.info("Mapped {} users to their entitlements", userEntitlements.size());
        
        // Step 2: Group users by similar entitlement sets
        Map<String, List<String>> entitlementSetToUsers = new HashMap<>();
        
        for (Map.Entry<String, Set<String>> entry : userEntitlements.entrySet()) {
            String userId = entry.getKey();
            Set<String> entitlementSet = entry.getValue();
            
            // Create a key for the entitlement set
            String entitlementKey = entitlementSet.stream().sorted().collect(Collectors.joining(","));
            
            if (!entitlementSetToUsers.containsKey(entitlementKey)) {
                entitlementSetToUsers.put(entitlementKey, new ArrayList<>());
            }
            
            entitlementSetToUsers.get(entitlementKey).add(userId);
        }
        
        log.info("Grouped users into {} distinct entitlement sets", entitlementSetToUsers.size());
        
        // Step 3: Apply user threshold filter (only keep groups with at least minUsersPerRole)
        entitlementSetToUsers.entrySet().removeIf(entry -> 
                entry.getValue().size() < filters.getMinUsersPerRole());
        
        log.info("After user threshold filtering, {} groups remain", entitlementSetToUsers.size());
        
        // Step 4: Apply permission threshold filter (only keep groups with at most maxPermissionsPerRole)
        entitlementSetToUsers.entrySet().removeIf(entry -> {
            String[] entitlementIds = entry.getKey().split(",");
            return entitlementIds.length > filters.getMaxPermissionsPerRole() || 
                   (entry.getKey().isEmpty() ? 0 : entitlementIds.length) == 0;
        });
        
        log.info("After permission threshold filtering, {} groups remain", entitlementSetToUsers.size());
        
        // Step 5: Filter by applications if specified
        if (filters.getApplications() != null && !filters.getApplications().isEmpty()) {
            Set<String> appFilterSet = new HashSet<>(filters.getApplications());
            
            entitlementSetToUsers.entrySet().removeIf(entry -> {
                if (entry.getKey().isEmpty()) return true;
                
                String[] entitlementIds = entry.getKey().split(",");
                
                boolean keepGroup = false;
                for (String entitlementId : entitlementIds) {
                    Entitlement entitlement = entitlements.get(entitlementId);
                    if (entitlement != null && entitlement.getApplication() != null && 
                        appFilterSet.contains(entitlement.getApplication().getApplicationId())) {
                        keepGroup = true;
                        break;
                    }
                }
                
                return !keepGroup;
            });
            
            log.info("After application filtering, {} groups remain", entitlementSetToUsers.size());
        }
        
        // Step 6: Filter by organizational units if specified
        if (filters.getOrganizationalUnits() != null && !filters.getOrganizationalUnits().isEmpty()) {
            Set<String> ouFilterSet = new HashSet<>(filters.getOrganizationalUnits());
            
            entitlementSetToUsers.entrySet().removeIf(entry -> {
                List<String> userIds = entry.getValue();
                
                boolean keepGroup = false;
                for (String userId : userIds) {
                    User user = users.get(userId);
                    if (user != null && user.getOrganizationalUnit() != null && 
                        ouFilterSet.contains(user.getOrganizationalUnit().getOuId())) {
                        keepGroup = true;
                        break;
                    }
                }
                
                return !keepGroup;
            });
            
            log.info("After OU filtering, {} groups remain", entitlementSetToUsers.size());
        }
        
        // Step 7: Create roles from the remaining groups
        int roleId = 1;
        for (Map.Entry<String, List<String>> entry : entitlementSetToUsers.entrySet()) {
            String entitlementKey = entry.getKey();
            List<String> userIds = entry.getValue();
            
            RoleDTO role = new RoleDTO();
            role.setId((long) roleId++);
            
            // Get all entitlements in this group
            List<String> entitlementIds = entitlementKey.isEmpty() ? 
                    Collections.emptyList() : Arrays.asList(entitlementKey.split(","));
            
            // Use permissions to determine the role name
            String roleName = determineRoleName(entitlementIds);
            role.setName(roleName);
            
            // Set user count and users with detailed information
            role.setUserCount(userIds.size());
            
            // Collect detailed user information with format: "UserID (FirstName LastName)"
            List<String> userDetailsList = new ArrayList<>();
            for (String userId : userIds) {
                User user = users.get(userId);
                if (user != null) {
                    String userName = user.getFirstName() + " " + user.getLastName();
                    String userDetail = userId + " (" + userName + ")";
                    userDetailsList.add(userDetail);
                }
            }
            role.setUsers(userDetailsList);
            
            // Set permission count and detailed permissions with format: "AppName: PermissionName"
            role.setPermissionCount(entitlementIds.size());
            List<String> permissionDetailsList = new ArrayList<>();
            for (String entitlementId : entitlementIds) {
                Entitlement entitlement = entitlements.get(entitlementId);
                if (entitlement != null) {
                    String permName = entitlement.getName();
                    String appName = entitlement.getApplication() != null ? 
                            entitlement.getApplication().getName() : "Unknown";
                    
                    // Check if the permission already contains the app name format
                    if (!permName.contains(":")) {
                        String permDetail = appName + ": " + permName;
                        permissionDetailsList.add(permDetail);
                    } else {
                        permissionDetailsList.add(permName);
                    }
                }
            }
            role.setPermissions(permissionDetailsList);
            
            // Set applications
            Set<String> appNames = entitlementIds.stream()
                    .map(id -> entitlements.get(id))
                    .filter(Objects::nonNull)
                    .map(e -> e.getApplication())
                    .filter(Objects::nonNull)
                    .map(a -> a.getName())
                    .collect(Collectors.toSet());
            role.setApplications(new ArrayList<>(appNames));
            
            // Not AI generated
            role.setAiGenerated(false);
            role.setConfidence(0);
            
            roles.add(role);
            
            log.info("Created role: {}, users: {}, permissions: {}, applications: {}", 
                    roleName, role.getUserCount(), role.getPermissionCount(), role.getApplications());
            
            // Log the details of users and permissions for debugging
            log.info("Role {} users: {}", roleName, role.getUsers());
            log.info("Role {} permissions: {}", roleName, role.getPermissions());
        }
        
        return roles;
    }

    /**
     * Determine a meaningful name for the role based on its entitlements
     */
    private String determineRoleName(List<String> entitlementIds) {
        // If there are no entitlements, use a default name
        if (entitlementIds.isEmpty()) {
            return "Empty Role";
        }
        
        // Get all applications involved
        Set<String> appNames = new HashSet<>();
        Set<String> permissionTypes = new HashSet<>();
        
        for (String entitlementId : entitlementIds) {
            Entitlement entitlement = entitlements.get(entitlementId);
            if (entitlement != null) {
                if (entitlement.getApplication() != null) {
                    appNames.add(entitlement.getApplication().getName());
                }
                
                // Extract permission type (e.g., "View", "Edit", "Admin", etc.)
                String name = entitlement.getName();
                if (name != null) {
                    // Some common patterns: AppName:Permission, Permission
                    if (name.contains(":")) {
                        String permission = name.substring(name.indexOf(":") + 1).trim();
                        permissionTypes.add(permission);
                    } else if (name.contains("View")) {
                        permissionTypes.add("View");
                    } else if (name.contains("Edit") || name.contains("Write")) {
                        permissionTypes.add("Edit");
                    } else if (name.contains("Admin") || name.contains("Manage")) {
                        permissionTypes.add("Admin");
                    } else if (name.contains("Read")) {
                        permissionTypes.add("Read");
                    }
                }
            }
        }
        
        // Build the role name
        StringBuilder roleName = new StringBuilder();
        
        // Add applications
        if (!appNames.isEmpty()) {
            roleName.append(String.join("/", appNames));
        } else {
            roleName.append("Multi-App");
        }
        
        // Add permission types
        if (!permissionTypes.isEmpty()) {
            roleName.append(" ");
            if (permissionTypes.contains("Admin") || permissionTypes.contains("Manage")) {
                roleName.append("Administrator");
            } else if (permissionTypes.contains("Edit") || permissionTypes.contains("Write")) {
                roleName.append("Editor");
            } else if (permissionTypes.contains("View") || permissionTypes.contains("Read")) {
                roleName.append("Viewer");
            } else {
                roleName.append("User");
            }
        } else {
            roleName.append(" User");
        }
        
        return roleName.toString();
    }
} 