package com.roleopt.rolemining.service;

import com.roleopt.rolemining.dto.RoleDTO;
import com.roleopt.rolemining.dto.RoleMiningFilterDTO;
import org.springframework.core.io.Resource;

import java.util.List;

public interface RoleMiningService {

    /**
     * Mine roles based on the provided filters
     *
     * @param filters the filters to apply during role mining
     * @return a list of discovered roles
     */
    List<RoleDTO> mineRoles(RoleMiningFilterDTO filters);

    /**
     * Get the latest role mining results
     *
     * @return a list of discovered roles
     */
    List<RoleDTO> getLatestResults();

    /**
     * Get AI-suggested roles based on access patterns
     *
     * @return a list of AI-suggested roles
     */
    List<RoleDTO> getAiSuggestions();

    /**
     * Generate a CSV report of the role mining results
     *
     * @return a Resource containing the CSV report
     */
    Resource generateReport();
} 