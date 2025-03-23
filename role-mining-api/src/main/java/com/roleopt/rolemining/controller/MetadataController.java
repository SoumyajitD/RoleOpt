package com.roleopt.rolemining.controller;

import com.roleopt.rolemining.dto.ApplicationDTO;
import com.roleopt.rolemining.dto.OrganizationalUnitDTO;
import com.roleopt.rolemining.model.Application;
import com.roleopt.rolemining.model.OrganizationalUnit;
import com.roleopt.rolemining.service.impl.UploadServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/metadata")
public class MetadataController {

    private static final Logger log = LoggerFactory.getLogger(MetadataController.class);
    
    private final UploadServiceImpl uploadService;
    
    public MetadataController(UploadServiceImpl uploadService) {
        this.uploadService = uploadService;
    }
    
    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDTO>> getApplications() {
        log.info("Fetching applications for frontend");
        List<ApplicationDTO> applications = uploadService.getApplications().values().stream()
            .map(app -> new ApplicationDTO(app.getApplicationId(), app.getName(), app.getDescription()))
            .collect(Collectors.toList());
        
        log.info("Returning {} applications", applications.size());
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/organizational-units")
    public ResponseEntity<List<OrganizationalUnitDTO>> getOrganizationalUnits() {
        log.info("Fetching organizational units for frontend");
        List<OrganizationalUnitDTO> ous = uploadService.getOrganizationalUnits().values().stream()
            .map(ou -> new OrganizationalUnitDTO(ou.getOuId(), ou.getName(), ou.getDescription()))
            .collect(Collectors.toList());
        
        log.info("Returning {} organizational units", ous.size());
        return ResponseEntity.ok(ous);
    }
} 