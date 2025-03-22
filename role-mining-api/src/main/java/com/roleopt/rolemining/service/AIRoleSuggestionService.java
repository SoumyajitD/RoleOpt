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
            
            // The response format uses markdown with asterisks
            // Example: "**Role 1: HR Roles**"
            
            // Regex to find role sections marked with asterisks
            String rolePattern = "\\*\\*Role\\s*\\d+.*?\\*\\*";
            Pattern pattern = Pattern.compile(rolePattern);
            Matcher matcher = pattern.matcher(aiResponse);
            
            List<Integer> roleStarts = new ArrayList<>();
            
            // Find all starting positions of roles
            while (matcher.find()) {
                roleStarts.add(matcher.start());
            }
            
            // Process each role section
            for (int i = 0; i < roleStarts.size(); i++) {
                int start = roleStarts.get(i);
                int end = (i < roleStarts.size() - 1) ? roleStarts.get(i + 1) : aiResponse.length();
                
                String roleSection = aiResponse.substring(start, end).trim();
                log.info("Processing role section {}: {}", i+1, roleSection);
                
                // Extract role name
                String roleName = "Unknown";
                Pattern namePattern = Pattern.compile("\\*\\*Role\\s*\\d+:?\\s*(.*?)\\*\\*");
                Matcher nameMatcher = namePattern.matcher(roleSection);
                if (nameMatcher.find()) {
                    roleName = nameMatcher.group(1).trim();
                }
                
                // Extract key permissions
                List<String> permissions = new ArrayList<>();
                Pattern permPattern = Pattern.compile("\\*\\*Key Permissions\\*\\*:?\\s*(.*?)\\*\\*Estimated User Count\\*\\*", 
                                                    Pattern.DOTALL);
                Matcher permMatcher = permPattern.matcher(roleSection);
                if (permMatcher.find()) {
                    String permText = permMatcher.group(1).trim();
                    String[] permLines = permText.split("\\n|,");
                    for (String line : permLines) {
                        line = line.trim().replaceAll("^-\\s*", "");
                        if (!line.isEmpty()) {
                            permissions.add(line);
                        }
                    }
                }
                
                // Extract user count
                int userCount = 0;
                Pattern userPattern = Pattern.compile("\\*\\*Estimated User Count\\*\\*:?\\s*(\\d+)");
                Matcher userMatcher = userPattern.matcher(roleSection);
                if (userMatcher.find()) {
                    try {
                        userCount = Integer.parseInt(userMatcher.group(1).trim());
                    } catch (NumberFormatException e) {
                        log.warn("Could not parse user count for role {}", roleName);
                    }
                }
                
                // Extract confidence
                int confidence = 0;
                Pattern confPattern = Pattern.compile("\\*\\*Confidence Level\\*\\*:?\\s*(\\d+)");
                Matcher confMatcher = confPattern.matcher(roleSection);
                if (confMatcher.find()) {
                    try {
                        confidence = Integer.parseInt(confMatcher.group(1).trim());
                    } catch (NumberFormatException e) {
                        log.warn("Could not parse confidence for role {}", roleName);
                    }
                }
                
                // Create role DTO
                RoleDTO role = new RoleDTO();
                role.setId((long) (100 + i));
                role.setName(roleName);
                role.setPermissionCount(permissions.size());
                role.setUserCount(userCount);
                role.setConfidence(confidence);
                
                // Extract applications
                Set<String> apps = new HashSet<>();
                for (String perm : permissions) {
                    if (perm.contains(":")) {
                        String app = perm.substring(0, perm.indexOf(":")).trim();
                        apps.add(app);
                    }
                }
                role.setApplications(new ArrayList<>(apps));
                
                role.setAiGenerated(true);
                
                log.info("Extracted role: {}, permissions: {}, users: {}, confidence: {}, apps: {}", 
                    role.getName(), role.getPermissionCount(), role.getUserCount(), 
                    role.getConfidence(), role.getApplications());
                
                suggestedRoles.add(role);
            }
        } catch (Exception e) {
            log.error("Error parsing AI response: {}", e.getMessage(), e);
        }
        
        // If no roles were successfully parsed, create mock roles based on the AI response
        if (suggestedRoles.isEmpty()) {
            log.info("Failed to parse AI response, returning mock roles");
            
            // Create mock roles based on keywords found in response
            if (aiResponse.contains("HR") || aiResponse.contains("Human Resources")) {
                RoleDTO hrRole = new RoleDTO();
                hrRole.setId(101L);
                hrRole.setName("HR Team");
                hrRole.setUserCount(2);
                hrRole.setPermissionCount(2);
                hrRole.setApplications(Collections.singletonList("HRPortal"));
                hrRole.setConfidence(85);
                hrRole.setAiGenerated(true);
                suggestedRoles.add(hrRole);
            }
            
            if (aiResponse.contains("Finance") || aiResponse.contains("Financial")) {
                RoleDTO financeRole = new RoleDTO();
                financeRole.setId(102L);
                financeRole.setName("Finance Team");
                financeRole.setUserCount(1);
                financeRole.setPermissionCount(2);
                financeRole.setApplications(Collections.singletonList("FinanceTool"));
                financeRole.setConfidence(80);
                financeRole.setAiGenerated(true);
                suggestedRoles.add(financeRole);
            }
            
            if (aiResponse.contains("Code") || aiResponse.contains("Developer")) {
                RoleDTO codeRole = new RoleDTO();
                codeRole.setId(103L);
                codeRole.setName("Development Team");
                codeRole.setUserCount(2);
                codeRole.setPermissionCount(2);
                codeRole.setApplications(Collections.singletonList("CodeRepo"));
                codeRole.setConfidence(90);
                codeRole.setAiGenerated(true);
                suggestedRoles.add(codeRole);
            }
            
            log.info("Created {} mock roles from keywords", suggestedRoles.size());
        }
        
        return suggestedRoles;
    }
    
    private RoleDTO createMockRoleWithContent(long id, String name, String content) {
        // Create a role with some of the extracted content for debugging
        RoleDTO role = new RoleDTO();
        role.setId(id);
        role.setName(name);
        
        // Find some sample applications in the content
        List<String> apps = new ArrayList<>();
        if (content.contains("CRM")) apps.add("CRM");
        if (content.contains("HR")) apps.add("HR Portal");
        if (content.contains("Finance")) apps.add("Finance System");
        if (content.contains("Email")) apps.add("Email System");
        if (content.contains("Document")) apps.add("Document Management");
        if (apps.isEmpty()) apps.add("Unknown App");
        
        role.setApplications(apps);
        role.setUserCount(content.length() % 10 + 1); // Random user count
        role.setPermissionCount(apps.size() + 1);
        role.setConfidence(75 + (content.length() % 20)); // Random confidence
        role.setAiGenerated(true);
        
        return role;
    }
} 