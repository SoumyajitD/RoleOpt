package com.roleopt.rolemining;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class RoleMiningApplication {

    public static void main(String[] args) {
        SpringApplication.run(RoleMiningApplication.class, args);
    }
} 