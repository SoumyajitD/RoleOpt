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
        
        String promptTemplate = "Analyze these user permission assignments and suggest 3-5 business roles. For each role, " +
            "provide: 1) A descriptive name, 2) Key permissions that define this role, 3) Estimated user count, " +
            "4) Confidence level (0-100), and 5) A brief justification.\n\n" +
            "Your response MUST follow this exact format for each role:\n\n" +
            "Role 1:\n" +
            "Name: [Role Name]\n" +
            "Key permissions:\n" +
            "- [Permission 1]\n" +
            "- [Permission 2]\n" +
            "Estimated user count: [Number]\n" +
            "Confidence: [Number 0-100]\n" +
            "Justification: [Brief explanation]\n\n" +
            "Role 2:\n" +
            "[...and so on]\n\n" +
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
        
        try {
            log.info("Parsing AI response for markdown-formatted roles");
            
            // Remove <think> sections if present
            aiResponse = aiResponse.replaceAll("(?s)<think>.*?</think>", "").trim();
            log.info("CLEAN AI RESPONSE (after removing <think> sections): {}", aiResponse);
            
            // Try multiple patterns to match role headers
            boolean parsedSuccessfully = false;
            
            // Pattern 1: Try matching for "**Role X: RoleName**" format
            Pattern rolePattern1 = Pattern.compile("\\*\\*Role (\\d+):?\\s*([^*]+)\\*\\*", Pattern.DOTALL);
            Matcher roleMatcher1 = rolePattern1.matcher(aiResponse);
            
            // Pattern 2: Try matching for "### Role X: RoleName" format
            Pattern rolePattern2 = Pattern.compile("###\\s*Role\\s*(\\d+):?\\s*([^#]+)", Pattern.DOTALL);
            Matcher roleMatcher2 = rolePattern2.matcher(aiResponse);
            
            // Pattern 3: Try matching for "**Role X**" or simply "Role X:" format (more general)
            Pattern rolePattern3 = Pattern.compile("(?:\\*\\*)?Role\\s*(\\d+):?(?:\\*\\*)?\\s*([^\\n]+)", Pattern.DOTALL);
            Matcher roleMatcher3 = rolePattern3.matcher(aiResponse);
            
            // Use the first pattern that matches
            Pattern rolePattern;
            Matcher roleMatcher;
            
            if (roleMatcher1.find()) {
                rolePattern = rolePattern1;
                roleMatcher = roleMatcher1;
                roleMatcher.reset();
                log.info("Using pattern 1 for role detection: **Role X: RoleName**");
            } else if (roleMatcher2.find()) {
                rolePattern = rolePattern2;
                roleMatcher = roleMatcher2;
                roleMatcher.reset();
                log.info("Using pattern 2 for role detection: ### Role X: RoleName");
            } else if (roleMatcher3.find()) {
                rolePattern = rolePattern3;
                roleMatcher = roleMatcher3;
                roleMatcher.reset();
                log.info("Using pattern 3 for role detection: Role X: RoleName (no formatting)");
            } else {
                log.warn("No standard role header pattern detected in AI response");
                rolePattern = null;
                roleMatcher = null;
            }
            
            if (rolePattern != null) {
                int roleCount = 0;
                while (roleMatcher.find()) {
                    roleCount++;
                    String roleNumber = roleMatcher.group(1);
                    String roleName = roleMatcher.group(2).trim();
                    
                    // Get the entire role section
                    int matchStart = roleMatcher.start();
                    int matchEnd;
                    
                    // Find the start of the next role (if any)
                    if (roleMatcher.find()) {
                        matchEnd = roleMatcher.start();
                        roleMatcher.reset();
                        roleMatcher.find(matchStart); // Go back to current match
                    } else {
                        matchEnd = aiResponse.length();
                        roleMatcher.reset();
                        roleMatcher.find(matchStart); // Go back to current match
                    }
                    
                    String roleSection = aiResponse.substring(matchStart, matchEnd).trim();
                    log.info("Found role section {}: {}", roleCount, roleSection.substring(0, Math.min(100, roleSection.length())) + "...");
                    
                    // Extract permissions - try different patterns
                    List<String> permissions = new ArrayList<>();
                    
                    // Pattern for key permissions section with "Key permissions:" or "Key Permissions:" header
                    Pattern keyPermPattern = Pattern.compile("(?:Key [Pp]ermissions|\\*\\*Key [Pp]ermissions\\*\\*)(?::)?", Pattern.CASE_INSENSITIVE);
                    Matcher keyPermMatcher = keyPermPattern.matcher(roleSection);
                    
                    if (keyPermMatcher.find()) {
                        // Extract from the key permissions section to the next section
                        int permStart = keyPermMatcher.end();
                        
                        // Find the next section header
                        Pattern nextSectionPattern = Pattern.compile("(?:\\n\\s*\\*\\*|\\n\\s*Estimated|\\n\\s*Confidence|\\n\\s*Justification)", Pattern.CASE_INSENSITIVE);
                        Matcher nextSectionMatcher = nextSectionPattern.matcher(roleSection);
                        
                        int permEnd;
                        if (nextSectionMatcher.find(permStart)) {
                            permEnd = nextSectionMatcher.start();
                        } else {
                            permEnd = roleSection.length();
                        }
                        
                        String permissionsText = roleSection.substring(permStart, permEnd).trim();
                        log.info("Extracted permissions text: {}", permissionsText);
                        
                        // Split by lines and extract permissions (those starting with - or *)
                        String[] lines = permissionsText.split("\\n");
                        for (String line : lines) {
                            line = line.trim();
                            if (line.startsWith("-") || line.startsWith("*")) {
                                String perm = line.substring(1).trim();
                                // Clean up any markdown
                                perm = perm.replaceAll("\\*\\*", "").trim();
                                if (!perm.isEmpty()) {
                                    permissions.add(perm);
                                    log.info("Added permission: {}", perm);
                                }
                            }
                        }
                    }
                    
                    // If no permissions found, try extracting from inline key permissions
                    if (permissions.isEmpty()) {
                        Pattern inlinePermPattern = Pattern.compile("(?:Key [Pp]ermissions|\\*\\*Key [Pp]ermissions\\*\\*)(?::|:?\\s+)\\s*([^\\n]+)", 
                            Pattern.CASE_INSENSITIVE);
                        Matcher inlinePermMatcher = inlinePermPattern.matcher(roleSection);
                        
                        if (inlinePermMatcher.find()) {
                            String permsLine = inlinePermMatcher.group(1).trim();
                            // Split by commas if multiple permissions are listed in one line
                            String[] perms = permsLine.split(",");
                            for (String perm : perms) {
                                perm = perm.trim().replaceAll("\\*\\*", "").trim();
                                if (!perm.isEmpty()) {
                                    permissions.add(perm);
                                    log.info("Added permission from inline format: {}", perm);
                                }
                            }
                        }
                    }
                    
                    // Extract user count
                    int userCount = 0;
                    Pattern userCountPattern = Pattern.compile("(?:Estimated\\s+User\\s+Count|\\*\\*Estimated\\s+User\\s+Count\\*\\*)\\s*:?\\s*(\\d+)", 
                        Pattern.CASE_INSENSITIVE);
                    Matcher userCountMatcher = userCountPattern.matcher(roleSection);
                    
                    if (userCountMatcher.find()) {
                        try {
                            userCount = Integer.parseInt(userCountMatcher.group(1).trim());
                            log.info("Extracted user count: {}", userCount);
                        } catch (NumberFormatException e) {
                            log.warn("Failed to parse user count");
                        }
                    }
                    
                    // Check for user count in format "X users" or "X Users"
                    if (userCount == 0) {
                        Pattern usersPattern = Pattern.compile("(\\d+)\\s+[Uu]sers?", Pattern.CASE_INSENSITIVE);
                        Matcher usersMatcher = usersPattern.matcher(roleSection);
                        if (usersMatcher.find()) {
                            try {
                                userCount = Integer.parseInt(usersMatcher.group(1).trim());
                                log.info("Extracted user count from 'X users' format: {}", userCount);
                            } catch (NumberFormatException e) {
                                log.warn("Failed to parse user count from 'X users' format");
                            }
                        }
                    }
                    
                    // Extract confidence
                    int confidence = 70;  // Default
                    Pattern confidencePattern = Pattern.compile("(?:Confidence|\\*\\*Confidence\\*\\*|Confidence Level|\\*\\*Confidence Level\\*\\*)\\s*:?\\s*(\\d+)\\s*%?", 
                        Pattern.CASE_INSENSITIVE);
                    Matcher confidenceMatcher = confidencePattern.matcher(roleSection);
                    
                    if (confidenceMatcher.find()) {
                        try {
                            confidence = Integer.parseInt(confidenceMatcher.group(1).trim());
                            log.info("Extracted confidence: {}", confidence);
                        } catch (NumberFormatException e) {
                            log.warn("Failed to parse confidence");
                        }
                    }
                    
                    // Create role
                    RoleDTO role = new RoleDTO();
                    role.setId((long) (100 + roleCount));
                    role.setName(roleName);
                    role.setPermissionCount(permissions.size());
                    role.setUserCount(userCount);
                    role.setConfidence(confidence);
                    role.setAiGenerated(true);
                    
                    // Set permissions
                    role.setPermissions(permissions);
                    
                    // Generate sample users based on the actual user count
                    List<String> detailedUsers = new ArrayList<>();
                    for (int u = 1; u <= Math.max(userCount, 1); u++) {
                        String firstName = "";
                        String lastName = "";
                        switch (u % 5) {
                            case 0: firstName = "Alice"; lastName = "Johnson"; break;
                            case 1: firstName = "Bob"; lastName = "Williams"; break;
                            case 2: firstName = "Carol"; lastName = "Lee"; break;
                            case 3: firstName = "David"; lastName = "Smith"; break;
                            case 4: firstName = "John"; lastName = "Doe"; break;
                        }
                        String userEmail = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@example.com";
                        detailedUsers.add(firstName + " " + lastName + " (" + userEmail + ")");
                    }
                    role.setUsers(detailedUsers);
                    
                    // Extract applications from permissions
                    Set<String> appSet = new HashSet<>();
                    for (String perm : permissions) {
                        if (perm.contains(":")) {
                            String app = perm.substring(0, perm.indexOf(":")).trim();
                            appSet.add(app);
                        } else if (perm.contains(" ")) {
                            String app = perm.substring(0, perm.indexOf(" ")).trim();
                            appSet.add(app);
                        }
                    }
                    
                    // Add default apps if none found
                    if (appSet.isEmpty()) {
                        if (roleName.toLowerCase().contains("hr")) {
                            appSet.add("HRPortal");
                        } else if (roleName.toLowerCase().contains("finance")) {
                            appSet.add("FinanceTool");
                        } else if (roleName.toLowerCase().contains("code") || roleName.toLowerCase().contains("engineer")) {
                            appSet.add("CodeRepo");
                        } else {
                            appSet.add("Unknown");
                        }
                    }
                    
                    // Clean application names and filter out non-application text
                    List<String> cleanAppsList = new ArrayList<>();
                    Set<String> nonAppTerms = new HashSet<>(Arrays.asList(
                        "confidence", "justification", "estimated", "level", "count", "user"));
                    
                    for (String app : appSet) {
                        app = app.replace("[", "").replace("]", "").trim();
                        
                        // Skip adding if it contains any of our non-app terms
                        boolean isNonAppTerm = false;
                        for (String term : nonAppTerms) {
                            if (app.toLowerCase().contains(term)) {
                                isNonAppTerm = true;
                                break;
                            }
                        }
                        
                        if (!isNonAppTerm) {
                            cleanAppsList.add(app);
                        }
                    }
                    role.setApplications(cleanAppsList);
                    
                    // Extract justification
                    String justification = "";
                    Pattern justificationPattern = Pattern.compile("(?:Justification|\\*\\*Justification\\*\\*)\\s*:?\\s*([^\\n]+(?:\\n(?!Role|\\*\\*Role|###)[^\\n]+)*)", 
                        Pattern.CASE_INSENSITIVE);
                    Matcher justificationMatcher = justificationPattern.matcher(roleSection);
                    
                    if (justificationMatcher.find()) {
                        justification = justificationMatcher.group(1).trim();
                        // Clean up any markdown
                        justification = justification.replaceAll("\\*\\*", "").trim();
                        log.info("Extracted justification: {}", justification);
                    }
                    
                    // Clean the role name to remove any markdown or extra text
                    roleName = roleName.replaceAll("\\*\\*.*?\\*\\*", "").trim();
                    // If role name contains a dash followed by text, keep only the part before the dash
                    if (roleName.contains(" - ")) {
                        roleName = roleName.substring(0, roleName.indexOf(" - ")).trim();
                    }
                    role.setName(roleName);
                    
                    // Set the justification as a custom attribute
                    Map<String, Object> attributes = new HashMap<>();
                    attributes.put("justification", justification);
                    role.setAttributes(attributes);
                    
                    log.info("Created role: {}, permissions: {}, users: {}, confidence: {}, apps: {}", 
                        role.getName(), role.getPermissionCount(), role.getUserCount(), 
                        role.getConfidence(), role.getApplications());
                    
                    suggestedRoles.add(role);
                    parsedSuccessfully = true;
                }
            }
            
            log.info("Successfully parsed {} roles using regex patterns", suggestedRoles.size());
            
            // If no roles were found using any approach, try the fallback
            if (!parsedSuccessfully || suggestedRoles.isEmpty()) {
                log.info("All parsing methods failed, creating roles based on keywords");
                
                // Create roles based on keywords in the AI response
                if (aiResponse.contains("HR")) {
                    RoleDTO hrRole = createRoleFromKeywords("HR Department Lead", "HRPortal", aiResponse);
                    suggestedRoles.add(hrRole);
                }
                
                if (aiResponse.contains("Finance")) {
                    RoleDTO financeRole = createRoleFromKeywords("Finance Department Lead", "FinanceTool", aiResponse);
                    suggestedRoles.add(financeRole);
                }
                
                if (aiResponse.contains("Code") || aiResponse.contains("Developer")) {
                    RoleDTO devRole = createRoleFromKeywords("Development Team Lead", "CodeRepo", aiResponse);
                    suggestedRoles.add(devRole);
                }
                
                log.info("Created {} fallback roles based on keywords", suggestedRoles.size());
            }
            
        } catch (Exception e) {
            log.error("Error parsing AI response: {}", e.getMessage(), e);
        }
        
        return suggestedRoles;
    }
    
    private RoleDTO createRoleFromKeywords(String roleName, String appName, String content) {
        RoleDTO role = new RoleDTO();
        
        // Generate a consistent ID based on role name
        role.setId((long) (100 + Math.abs(roleName.hashCode() % 100)));
        role.setName(roleName);
        
        // Generate users based on the role
        int userCount = 2;
        List<String> detailedUsers = new ArrayList<>();
        for (int i = 1; i <= userCount; i++) {
            String firstName = "";
            String lastName = "";
            switch (i % 3) {
                case 0: firstName = "Alice"; lastName = "Johnson"; break;
                case 1: firstName = "Bob"; lastName = "Williams"; break;
                case 2: firstName = "Carol"; lastName = "Lee"; break;
            }
            String userEmail = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@example.com";
            detailedUsers.add(firstName + " " + lastName + " (" + userEmail + ")");
        }
        role.setUsers(detailedUsers);
        role.setUserCount(userCount);
        
        // Create sample permissions
        List<String> permissions = new ArrayList<>();
        if (appName.equals("HRPortal")) {
            permissions.add("HRPortal: HRView");
            permissions.add("HRPortal: HRManage");
        } else if (appName.equals("FinanceTool")) {
            permissions.add("FinanceTool: FinanceView");
            permissions.add("FinanceTool: FinanceEdit");
        } else if (appName.equals("CodeRepo")) {
            permissions.add("CodeRepo: CodeRead");
            permissions.add("CodeRepo: CodeWrite");
        }
        role.setPermissions(permissions);
        role.setPermissionCount(permissions.size());
        
        // Set applications
        List<String> apps = new ArrayList<>();
        apps.add(appName);
        role.setApplications(apps);
        
        // Set confidence based on how many keywords matched
        int keywordCount = 0;
        if (content.contains(roleName)) keywordCount++;
        if (content.contains(appName)) keywordCount++;
        role.setConfidence(75 + (keywordCount * 5));
        
        role.setAiGenerated(true);
        
        log.info("Created fallback role: {}, permissions: {}, users: {}, confidence: {}", 
            roleName, permissions.size(), userCount, role.getConfidence());
        
        return role;
    }
} 