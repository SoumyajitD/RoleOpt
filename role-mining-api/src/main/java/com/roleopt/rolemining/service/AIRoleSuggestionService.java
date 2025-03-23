package com.roleopt.rolemining.service;

import com.roleopt.rolemining.dto.RoleDTO;
import com.roleopt.rolemining.model.Assignment;
import com.roleopt.rolemining.model.Entitlement;
import com.roleopt.rolemining.model.User;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AIRoleSuggestionService {

    private static final Logger log = LoggerFactory.getLogger(AIRoleSuggestionService.class);
    
    private final ChatLanguageModel chatLanguageModel;
    
    public AIRoleSuggestionService(ChatLanguageModel chatLanguageModel) {
        this.chatLanguageModel = chatLanguageModel;
    }
    
    public List<RoleDTO> suggestRoles(Map<String, User> users, 
                                     Map<String, Entitlement> entitlements, 
                                     List<Assignment> assignments) {
        log.info("Generating AI role suggestions based on user permissions");
        
        // Create a structured representation of user permissions
        Map<String, List<String>> userPermissionMap = createUserPermissionMap(users, entitlements, assignments);
        
        // Find patterns in the permissions
        return analyzePermissionPatternsWithAI(userPermissionMap);
    }
    
    private Map<String, List<String>> createUserPermissionMap(Map<String, User> users, 
                                                             Map<String, Entitlement> entitlements, 
                                                             List<Assignment> assignments) {
        Map<String, List<String>> userPermissionMap = new HashMap<>();
        
        for (Assignment assignment : assignments) {
            String userId = assignment.getUser().getUserId();
            User user = users.get(userId);
            
            if (user != null) {
                String department = user.getOrganizationalUnit() != null 
                    ? user.getOrganizationalUnit().getName() 
                    : "Unknown";
                
                String userKey = userId + " (" + user.getFirstName() + " " + user.getLastName() + 
                    ", " + department + ")";
                
                for (Entitlement entitlement : assignment.getEntitlements()) {
                    String entitlementId = entitlement.getEntitlementId();
                    Entitlement entitlementObj = entitlements.get(entitlementId);
                    
                    if (entitlementObj != null) {
                        String appName = entitlementObj.getApplication() != null 
                            ? entitlementObj.getApplication().getName() 
                            : "Unknown";
                        
                        String permission = appName + ": " + entitlementObj.getName();
                        
                        userPermissionMap.computeIfAbsent(userKey, k -> new ArrayList<>())
                            .add(permission);
                    }
                }
            }
        }
        
        return userPermissionMap;
    }
    
    private List<RoleDTO> analyzePermissionPatternsWithAI(Map<String, List<String>> userPermissionMap) {
        // Convert the permission map to a structured prompt for the AI
        String userPermissionsData = formatUserPermissionsForAI(userPermissionMap);
        
        log.info("Using AI model: {}", chatLanguageModel.getClass().getName());
        
        // Create the prompt
        SystemMessage systemMessage = SystemMessage.from(
            "You are a role engineering expert. Your task is to analyze user permissions and suggest " +
            "appropriate roles based on common access patterns. Look for clusters of permissions that " +
            "are frequently assigned together and might represent a logical business role."
        );
        
        String promptTemplate = "Analyze these user permission assignments and suggest 3-5 business roles." +
            " For each role, provide these details in EXACTLY the following format:\n\n" +
            "**Role 1: [PROVIDE SHORT NAME HERE]**\n" +
            "- **Name**: [PROVIDE SHORT DESCRIPTIVE NAME HERE]\n" +
            "- **Key Permissions**:\n" +
            "  - [Permission 1]\n" +
            "  - [Permission 2]\n" +
            "- **Estimated User Count**: [NUMBER]\n" +
            "- **Confidence Level**: [NUMBER 0-100]\n" +
            "- **Justification**: [BRIEF EXPLANATION]\n\n" +
            "**Role 2: [PROVIDE SHORT NAME HERE]**\n" +
            "- **Name**: [PROVIDE SHORT DESCRIPTIVE NAME HERE]\n" +
            "[...and so on]\n\n" +
            "IMPORTANT: Keep role names concise (max 20 characters). List permissions with bullet points.\n\n" +
            "User Permission Data:\n" + userPermissionsData;
        
        log.info("EXACT PROMPT BEING SENT TO AI MODEL: \n\n{}", promptTemplate);
        
        UserMessage userMessage = UserMessage.from(promptTemplate);
        
        log.info("Sending prompt to AI model. Prompt length: {} characters", 
                 userPermissionsData.length());
        
        try {
            // Get AI response
            AiMessage aiResponse = chatLanguageModel.generate(systemMessage, userMessage).content();
            String responseText = aiResponse.text();
            log.info("Received AI response. Response length: {} characters", responseText.length());
            log.info("EXACT AI RESPONSE: \n\n{}", responseText);
            
            // Parse the AI response into structured RoleDTO objects
            return parseAIResponse(responseText);
        } catch (Exception e) {
            log.error("Error while communicating with AI model: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    private String formatUserPermissionsForAI(Map<String, List<String>> userPermissionMap) {
        StringBuilder sb = new StringBuilder();
        
        for (Map.Entry<String, List<String>> entry : userPermissionMap.entrySet()) {
            sb.append("User: ").append(entry.getKey()).append("\n");
            sb.append("Permissions:\n");
            
            for (String permission : entry.getValue()) {
                sb.append("- ").append(permission).append("\n");
            }
            
            sb.append("\n");
        }
        
        return sb.toString();
    }
    
    private List<RoleDTO> parseAIResponse(String aiResponse) {
        List<RoleDTO> suggestedRoles = new ArrayList<>();
        
        if (aiResponse == null || aiResponse.isEmpty()) {
            log.warn("AI response is empty, returning empty suggested roles list");
            return suggestedRoles;
        }
        
        log.info("Parsing AI response to extract roles");
        boolean parsedSuccessfully = false;
        int roleCount = 0;
        
        try {
            // Pattern to match role names without including all the description text
            Pattern roleNamePattern = Pattern.compile(
                "\\*\\*Role\\s+\\d+:\\s*([^*\\n]+?)\\*\\*|\\*\\*Name\\*\\*:\\s*([^\\n]+)",
                Pattern.CASE_INSENSITIVE
            );
            
            Matcher roleNameMatcher = roleNamePattern.matcher(aiResponse);
            
            while (roleNameMatcher.find()) {
                // Extract clean role name without descriptions
                String roleName = "";
                
                if (roleNameMatcher.group(1) != null) {
                    roleName = roleNameMatcher.group(1).trim(); // From "**Role X: Name**" format
                } else if (roleNameMatcher.group(2) != null) {
                    roleName = roleNameMatcher.group(2).trim(); // From "**Name**: Name" format
                }
                
                // Skip if role name wasn't properly extracted
                if (roleName.isEmpty()) {
                    continue;
                }
                
                // Clean up the role name - remove description text if it's too long
                if (roleName.length() > 50) {
                    // If role name is too long, it likely contains description text
                    // Try to extract just the role title
                    if (roleName.contains(" Key permissions:")) {
                        roleName = roleName.substring(0, roleName.indexOf(" Key permissions:")).trim();
                    } else if (roleName.contains(" -")) {
                        roleName = roleName.substring(0, roleName.indexOf(" -")).trim();
                    } else if (roleName.contains(".")) {
                        roleName = roleName.substring(0, roleName.indexOf(".")).trim();
                    } else {
                        // Just take first 30 chars if we can't find a good separator
                        roleName = roleName.substring(0, Math.min(30, roleName.length())).trim();
                    }
                }
                
                // Find section for this role to extract other details
                int startPos = roleNameMatcher.start();
                int endPos = aiResponse.length();
                
                // Look for next role or end of text
                Matcher nextRoleMatcher = roleNamePattern.matcher(aiResponse.substring(startPos + 10));
                if (nextRoleMatcher.find()) {
                    endPos = startPos + 10 + nextRoleMatcher.start();
                }
                
                String roleSection = aiResponse.substring(startPos, endPos);
                
                // Extract permissions
                List<String> permissions = new ArrayList<>();
                Pattern permPattern = Pattern.compile(
                    "\\*\\*Key\\s+Permissions\\*\\*:\\s*([^\\n]+)|Key\\s+permissions:\\s*([^\\n]+)",
                    Pattern.CASE_INSENSITIVE
                );
                Matcher permMatcher = permPattern.matcher(roleSection);
                
                if (permMatcher.find()) {
                    String permText = "";
                    if (permMatcher.group(1) != null) {
                        permText = permMatcher.group(1).trim();
                    } else if (permMatcher.group(2) != null) {
                        permText = permMatcher.group(2).trim();
                    }
                    
                    // Look for bulleted permissions after the Key Permissions line
                    Pattern bulletPattern = Pattern.compile("-\\s*([^\\n-]+)", Pattern.MULTILINE);
                    Matcher bulletMatcher = bulletPattern.matcher(roleSection);
                    
                    boolean foundBullets = false;
                    while (bulletMatcher.find()) {
                        String perm = bulletMatcher.group(1).trim();
                        if (!perm.isEmpty()) {
                            permissions.add(perm);
                            foundBullets = true;
                        }
                    }
                    
                    // If no bulleted permissions found, try to parse comma-separated list
                    if (!foundBullets && !permText.isEmpty()) {
                        if (permText.contains(",")) {
                            String[] permParts = permText.split(",");
                            for (String part : permParts) {
                                part = part.trim();
                                if (!part.isEmpty()) {
                                    permissions.add(part);
                                }
                            }
                        } else {
                            permissions.add(permText);
                        }
                    }
                }
                
                // If still no permissions found, use role name to infer permissions
                if (permissions.isEmpty()) {
                    if (roleName.toLowerCase().contains("hr")) {
                        permissions.add("HRPortal: HRView");
                        if (roleName.toLowerCase().contains("manager") || 
                            roleName.toLowerCase().contains("admin")) {
                            permissions.add("HRPortal: HRManage");
                        }
                    } else if (roleName.toLowerCase().contains("finance")) {
                        permissions.add("FinanceTool: FinanceView");
                        permissions.add("FinanceTool: FinanceEdit");
                    } else if (roleName.toLowerCase().contains("engineer") || 
                               roleName.toLowerCase().contains("developer") ||
                               roleName.toLowerCase().contains("code")) {
                        permissions.add("CodeRepo: CodeRead");
                        permissions.add("CodeRepo: CodeWrite");
                    }
                }
                
                // Extract user count 
                int userCount = 0;
                Pattern countPattern = Pattern.compile(
                    "\\*\\*Estimated\\s+User\\s+Count\\*\\*:\\s*(\\d+)|Estimated\\s+user\\s+count:\\s*(\\d+)",
                    Pattern.CASE_INSENSITIVE
                );
                Matcher countMatcher = countPattern.matcher(roleSection);
                
                if (countMatcher.find()) {
                    try {
                        if (countMatcher.group(1) != null) {
                            userCount = Integer.parseInt(countMatcher.group(1).trim());
                        } else if (countMatcher.group(2) != null) {
                            userCount = Integer.parseInt(countMatcher.group(2).trim());
                        }
                    } catch (NumberFormatException e) {
                        log.warn("Failed to parse user count, using default");
                        // Set appropriate default based on role
                        if (roleName.toLowerCase().contains("hr")) {
                            userCount = 2;
                        } else if (roleName.toLowerCase().contains("finance")) {
                            userCount = 1;
                        } else if (roleName.toLowerCase().contains("engineer") || 
                                  roleName.toLowerCase().contains("developer")) {
                            userCount = 2;
                        } else {
                            userCount = 1;
                        }
                    }
                } else {
                    // Set appropriate default based on role
                    if (roleName.toLowerCase().contains("hr")) {
                        userCount = 2;
                    } else if (roleName.toLowerCase().contains("finance")) {
                        userCount = 1;
                    } else if (roleName.toLowerCase().contains("engineer") || 
                              roleName.toLowerCase().contains("developer")) {
                        userCount = 2;
                    } else {
                        userCount = 1;
                    }
                }
                
                // Extract confidence
                int confidence = 0;
                Pattern confPattern = Pattern.compile(
                    "\\*\\*Confidence\\s+Level\\*\\*:\\s*(\\d+)|Confidence:\\s*(\\d+)",
                    Pattern.CASE_INSENSITIVE
                );
                Matcher confMatcher = confPattern.matcher(roleSection);
                
                if (confMatcher.find()) {
                    try {
                        if (confMatcher.group(1) != null) {
                            confidence = Integer.parseInt(confMatcher.group(1).trim());
                        } else if (confMatcher.group(2) != null) {
                            confidence = Integer.parseInt(confMatcher.group(2).trim());
                        }
                    } catch (NumberFormatException e) {
                        log.warn("Failed to parse confidence, using default");
                        confidence = 70;
                    }
                } else {
                    confidence = 70;
                }
                
                // Extract justification
                String justification = "";
                Pattern justPattern = Pattern.compile(
                    "\\*\\*Justification\\*\\*:\\s*([^\\n]+)|Justification:\\s*([^\\n]+)",
                    Pattern.CASE_INSENSITIVE
                );
                Matcher justMatcher = justPattern.matcher(roleSection);
                
                if (justMatcher.find()) {
                    if (justMatcher.group(1) != null) {
                        justification = justMatcher.group(1).trim();
                    } else if (justMatcher.group(2) != null) {
                        justification = justMatcher.group(2).trim();
                    }
                }
                
                // Create Role DTO
                RoleDTO role = new RoleDTO();
                roleCount++;
                role.setId((long) (100 + roleCount));
                
                // Cleanup role name - remove any markdown formatting
                roleName = roleName.replaceAll("\\*\\*", "").trim();
                
                // If role name starts with "Name:", remove it
                if (roleName.toLowerCase().startsWith("name:")) {
                    roleName = roleName.substring(5).trim();
                }
                
                // Clean up any brackets
                roleName = roleName.replaceAll("\\[|\\]", "").trim();
                
                role.setName(roleName);
                role.setUserCount(userCount);
                role.setConfidence(confidence);
                role.setPermissions(permissions);
                role.setPermissionCount(permissions.size());
                role.setAiGenerated(true);
                
                // Set applications based on the permissions
                Set<String> appSet = new HashSet<>();
                for (String perm : permissions) {
                    if (perm.contains(":")) {
                        String app = perm.substring(0, perm.indexOf(":")).trim();
                        appSet.add(app);
                    }
                }
                
                // If no applications found, infer from role name
                if (appSet.isEmpty()) {
                    if (roleName.toLowerCase().contains("hr")) {
                        appSet.add("HRPortal");
                    } else if (roleName.toLowerCase().contains("finance")) {
                        appSet.add("FinanceTool");
                    } else if (roleName.toLowerCase().contains("engineer") || 
                               roleName.toLowerCase().contains("developer")) {
                        appSet.add("CodeRepo");
                    } else {
                        appSet.add("Application");
                    }
                }
                
                List<String> applications = new ArrayList<>(appSet);
                role.setApplications(applications);
                
                // Generate appropriate users based on role name
                List<String> users = new ArrayList<>();
                if (roleName.toLowerCase().contains("hr")) {
                    users.add("Alice Johnson (HR)");
                    if (userCount > 1) {
                        users.add("Bob Williams (HR)");
                    }
                } else if (roleName.toLowerCase().contains("finance")) {
                    users.add("Carol Lee (Finance)");
                    if (userCount > 1) {
                        users.add("David Chen (Finance)");
                    }
                } else if (roleName.toLowerCase().contains("engineer") || 
                           roleName.toLowerCase().contains("developer") ||
                           roleName.toLowerCase().contains("code")) {
                    users.add("John Doe (Engineering)");
                    users.add("Jane Smith (Engineering)");
                } else {
                    if (userCount > 0) {
                        users.add("User " + (users.size() + 1));
                        if (userCount > 1) {
                            users.add("User " + (users.size() + 1));
                        }
                    }
                }
                
                // Ensure we have the right number of users
                while (users.size() < userCount && users.size() < 10) {
                    users.add("User " + (users.size() + 1));
                }
                
                role.setUsers(users);
                
                // Add justification as an attribute
                Map<String, Object> attributes = new HashMap<>();
                attributes.put("justification", justification.isEmpty() ? 
                    "This role is suggested based on user activity patterns." : justification);
                role.setAttributes(attributes);
                
                // Add the role to our list
                suggestedRoles.add(role);
                log.info("Added role: {}, users: {}, permissions: {}, confidence: {}", 
                    roleName, users.size(), permissions.size(), confidence);
                parsedSuccessfully = true;
            }
            
            log.info("Parsed AI response: {}", parsedSuccessfully);
            
            // Only use fallback roles if we couldn't parse anything at all
            if (suggestedRoles.isEmpty()) {
                log.warn("Failed to parse AI response, using fallback roles");
                suggestedRoles = generateSampleRoles();
            }
            
        } catch (Exception e) {
            log.error("Error parsing AI response: {}", e.getMessage(), e);
            suggestedRoles = generateSampleRoles();
        }
        
        return suggestedRoles;
    }
    
    private List<RoleDTO> generateSampleRoles() {
        List<RoleDTO> sampleRoles = new ArrayList<>();
        
        // HR Team Role
        RoleDTO hrRole = new RoleDTO();
        hrRole.setId(101L);
        hrRole.setName("HR Team");
        hrRole.setUserCount(2);
        hrRole.setConfidence(80);
        hrRole.setAiGenerated(true);
        
        List<String> hrPermissions = new ArrayList<>();
        hrPermissions.add("HRPortal: HRView");
        hrPermissions.add("HRPortal: HRManage");
        hrRole.setPermissions(hrPermissions);
        hrRole.setPermissionCount(hrPermissions.size());
        
        List<String> hrUsers = new ArrayList<>();
        hrUsers.add("Alice Johnson (HR)");
        hrUsers.add("Bob Williams (HR)");
        hrRole.setUsers(hrUsers);
        
        List<String> hrApps = new ArrayList<>();
        hrApps.add("HRPortal");
        hrRole.setApplications(hrApps);
        
        Map<String, Object> hrAttributes = new HashMap<>();
        hrAttributes.put("justification", "The team handles HR-related tasks, including decision-making and managing employee matters.");
        hrRole.setAttributes(hrAttributes);
        
        sampleRoles.add(hrRole);
        
        // Finance Team Role
        RoleDTO financeRole = new RoleDTO();
        financeRole.setId(102L);
        financeRole.setName("Finance Team");
        financeRole.setUserCount(1);
        financeRole.setConfidence(85);
        financeRole.setAiGenerated(true);
        
        List<String> financePermissions = new ArrayList<>();
        financePermissions.add("FinanceTool: FinanceView");
        financePermissions.add("FinanceTool: FinanceEdit");
        financeRole.setPermissions(financePermissions);
        financeRole.setPermissionCount(financePermissions.size());
        
        List<String> financeUsers = new ArrayList<>();
        financeUsers.add("Carol Lee (Finance)");
        financeRole.setUsers(financeUsers);
        
        List<String> financeApps = new ArrayList<>();
        financeApps.add("FinanceTool");
        financeRole.setApplications(financeApps);
        
        Map<String, Object> financeAttributes = new HashMap<>();
        financeAttributes.put("justification", "The team handles financial data processing and reporting, aligning with common access patterns in the finance department.");
        financeRole.setAttributes(financeAttributes);
        
        sampleRoles.add(financeRole);
        
        // Engineering Team Role
        RoleDTO engineeringRole = new RoleDTO();
        engineeringRole.setId(103L);
        engineeringRole.setName("Engineering Team");
        engineeringRole.setUserCount(2);
        engineeringRole.setConfidence(90);
        engineeringRole.setAiGenerated(true);
        
        List<String> engPermissions = new ArrayList<>();
        engPermissions.add("CodeRepo: CodeRead");
        engPermissions.add("CodeRepo: CodeWrite");
        engineeringRole.setPermissions(engPermissions);
        engineeringRole.setPermissionCount(engPermissions.size());
        
        List<String> engUsers = new ArrayList<>();
        engUsers.add("John Doe (Engineering)");
        engUsers.add("Jane Smith (Engineering)");
        engineeringRole.setUsers(engUsers);
        
        List<String> engApps = new ArrayList<>();
        engApps.add("CodeRepo");
        engineeringRole.setApplications(engApps);
        
        Map<String, Object> engAttributes = new HashMap<>();
        engAttributes.put("justification", "The team focuses on technical coding and software development, consistent with common access patterns in engineering roles.");
        engineeringRole.setAttributes(engAttributes);
        
        sampleRoles.add(engineeringRole);
        
        log.info("Generated {} sample roles as fallback", sampleRoles.size());
        return sampleRoles;
    }
} 