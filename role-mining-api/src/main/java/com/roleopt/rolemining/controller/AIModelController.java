package com.roleopt.rolemining.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai-models")
public class AIModelController {

    private static final Logger log = LoggerFactory.getLogger(AIModelController.class);
    
    @Value("${llm.model.type}")
    private String modelType;
    
    @Value("${ollama.base.url}")
    private String ollamaBaseUrl;
    
    @Value("${llm.model.name.openai:gpt-3.5-turbo}")
    private String openaiModelName;
    
    @Value("${llm.model.name.ollama:llama2}")
    private String ollamaModelName;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getModelConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("modelType", modelType);
        config.put("activeModel", "ollama".equals(modelType) ? ollamaModelName : openaiModelName);
        
        if ("ollama".equals(modelType)) {
            config.put("ollamaBaseUrl", ollamaBaseUrl);
            
            try {
                // Try to list available models
                String url = ollamaBaseUrl + "/api/tags";
                ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
                
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    config.put("availableModels", response.getBody().get("models"));
                    config.put("connectionStatus", "Connected");
                } else {
                    config.put("connectionStatus", "Failed to retrieve models");
                }
            } catch (Exception e) {
                log.error("Error connecting to Ollama: {}", e.getMessage());
                config.put("connectionStatus", "Error: " + e.getMessage());
                config.put("connectionTips", "Make sure Ollama is running on " + ollamaBaseUrl + 
                    ". Install from https://ollama.ai/ and run 'ollama serve' and 'ollama pull " + ollamaModelName + "'");
            }
        }
        
        return ResponseEntity.ok(config);
    }
} 