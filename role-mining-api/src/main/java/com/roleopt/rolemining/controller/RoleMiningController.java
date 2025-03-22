package com.roleopt.rolemining.controller;

import com.roleopt.rolemining.dto.RoleDTO;
import com.roleopt.rolemining.dto.RoleMiningFilterDTO;
import com.roleopt.rolemining.service.RoleMiningService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/role-mining")
public class RoleMiningController {

    private static final Logger log = LoggerFactory.getLogger(RoleMiningController.class);
    
    private final RoleMiningService roleMiningService;
    
    public RoleMiningController(RoleMiningService roleMiningService) {
        this.roleMiningService = roleMiningService;
    }

    @PostMapping("/run")
    public ResponseEntity<List<RoleDTO>> mineRoles(@RequestBody @Valid RoleMiningFilterDTO filters) {
        log.info("Received role mining request with filters: {}", filters);
        List<RoleDTO> roles = roleMiningService.mineRoles(filters);
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/results")
    public ResponseEntity<List<RoleDTO>> getResults() {
        List<RoleDTO> roles = roleMiningService.getLatestResults();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/ai-suggest")
    public ResponseEntity<List<RoleDTO>> getAiSuggestions() {
        log.info("Received request for AI-suggested roles");
        List<RoleDTO> suggestions = roleMiningService.getAiSuggestions();
        log.info("Returning {} AI-suggested roles", suggestions.size());
        
        // If no suggestions available, generate mock ones
        if (suggestions.isEmpty()) {
            log.info("No AI suggestions available, generating mock data");
            suggestions = generateMockAiSuggestions();
        }
        
        return ResponseEntity.ok(suggestions);
    }

    private List<RoleDTO> generateMockAiSuggestions() {
        List<RoleDTO> mockSuggestions = new ArrayList<>();
        
        RoleDTO role1 = new RoleDTO();
        role1.setId(101L);
        role1.setName("AI Role 1 - Sales Team");
        role1.setUserCount(18);
        role1.setPermissionCount(6);
        role1.setApplications(Arrays.asList("CRM", "Document Management", "Email System"));
        role1.setConfidence(92);
        role1.setAiGenerated(true);
        
        RoleDTO role2 = new RoleDTO();
        role2.setId(102L);
        role2.setName("AI Role 2 - Finance Staff");
        role2.setUserCount(9);
        role2.setPermissionCount(8);
        role2.setApplications(Arrays.asList("Finance System", "ERP System"));
        role2.setConfidence(88);
        role2.setAiGenerated(true);
        
        RoleDTO role3 = new RoleDTO();
        role3.setId(103L);
        role3.setName("AI Role 3 - HR Team");
        role3.setUserCount(7);
        role3.setPermissionCount(5);
        role3.setApplications(Arrays.asList("HR Portal", "Document Management"));
        role3.setConfidence(79);
        role3.setAiGenerated(true);
        
        mockSuggestions.add(role1);
        mockSuggestions.add(role2);
        mockSuggestions.add(role3);
        
        return mockSuggestions;
    }

    @GetMapping("/report")
    public ResponseEntity<Resource> generateReport() {
        Resource report = roleMiningService.generateReport();
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"role-mining-report.csv\"")
                .body(report);
    }
} 