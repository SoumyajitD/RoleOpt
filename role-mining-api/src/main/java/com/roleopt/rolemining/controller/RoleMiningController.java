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
        List<RoleDTO> suggestions = roleMiningService.getAiSuggestions();
        return ResponseEntity.ok(suggestions);
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