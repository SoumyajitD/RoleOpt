package com.roleopt.rolemining.controller;

import com.roleopt.rolemining.dto.DataSummaryDTO;
import com.roleopt.rolemining.service.UploadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private static final Logger log = LoggerFactory.getLogger(UploadController.class);
    
    private final UploadService uploadService;
    
    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    public ResponseEntity<Void> uploadFiles(
            @RequestParam(value = "users", required = false) MultipartFile usersFile,
            @RequestParam(value = "ou", required = false) MultipartFile ouFile,
            @RequestParam(value = "applications", required = false) MultipartFile applicationsFile,
            @RequestParam(value = "entitlements", required = false) MultipartFile entitlementsFile,
            @RequestParam(value = "assignments", required = false) MultipartFile assignmentsFile
    )throws Exception {
        log.info("Received file upload request");
        
        uploadService.processFiles(usersFile, ouFile, applicationsFile, entitlementsFile, assignmentsFile);
        
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/data-summary")
    public ResponseEntity<DataSummaryDTO> getDataSummary() {
        DataSummaryDTO summary = uploadService.getDataSummary();
        return ResponseEntity.ok(summary);
    }
} 