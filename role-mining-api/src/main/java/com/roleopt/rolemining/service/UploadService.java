package com.roleopt.rolemining.service;

import com.roleopt.rolemining.dto.DataSummaryDTO;
import com.roleopt.rolemining.model.Application;
import com.roleopt.rolemining.model.OrganizationalUnit;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface UploadService {

    /**
     * Process the uploaded files and store the data
     *
     * @param usersFile CSV file containing user data
     * @param ousFile CSV file containing organizational unit data
     * @param applicationsFile CSV file containing application data
     * @param entitlementsFile CSV file containing entitlement data
     * @param assignmentsFile CSV file containing assignment data
     * @throws Exception if there's an error processing the files
     */
    void processFiles(
            MultipartFile usersFile,
            MultipartFile ousFile,
            MultipartFile applicationsFile,
            MultipartFile entitlementsFile,
            MultipartFile assignmentsFile) throws Exception;

    /**
     * Get a summary of the uploaded data
     *
     * @return a summary DTO with counts of entities
     */
    DataSummaryDTO getDataSummary();

    Map<String, Application> getApplications();
    
    Map<String, OrganizationalUnit> getOrganizationalUnits();
} 