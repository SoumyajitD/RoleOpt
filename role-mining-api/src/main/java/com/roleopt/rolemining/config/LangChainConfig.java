package com.roleopt.rolemining.config;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.Duration;

@Configuration
public class LangChainConfig {

    private static final Logger log = LoggerFactory.getLogger(LangChainConfig.class);

    @Value("${openai.api.key:}")
    private String openaiApiKey;
    
    @Value("${ollama.base.url:http://localhost:11434}")
    private String ollamaBaseUrl;
    
    @Value("${llm.model.type:openai}")
    private String modelType;
    
    @Value("${llm.model.name.openai:gpt-3.5-turbo}")
    private String openaiModelName;
    
    @Value("${llm.model.name.ollama:llama2}")
    private String ollamaModelName;

    @Bean
    @Primary
    public ChatLanguageModel chatLanguageModel() {
        log.info("Initializing AI model with type: {}", modelType);
        log.info("Model type value: '{}', length: {}", modelType, modelType.length());
        log.info("Model type bytes: {}", modelType.getBytes());
        
        String trimmedType = modelType.trim();
        log.info("Trimmed model type: '{}', length: {}", trimmedType, trimmedType.length());
        
        boolean isOllama = "ollama".equalsIgnoreCase(trimmedType);
        log.info("Is Ollama? {}", isOllama);
        
        if (isOllama) {
            log.info("Using Ollama model: {} at URL: {}", ollamaModelName, ollamaBaseUrl);
            return createOllamaModel();
        } else {
            log.info("Using OpenAI model: {} with API key: {}", openaiModelName, 
                     openaiApiKey.substring(0, Math.min(openaiApiKey.length(), 5)) + "...");
            return createOpenAiModel();
        }
    }
    
    private ChatLanguageModel createOpenAiModel() {
        return OpenAiChatModel.builder()
                .apiKey(openaiApiKey)
                .modelName(openaiModelName)
                .temperature(0.7)
                .timeout(Duration.ofSeconds(60))
                .build();
    }
    
    private ChatLanguageModel createOllamaModel() {
        return OllamaChatModel.builder()
                .baseUrl(ollamaBaseUrl)
                .modelName(ollamaModelName)
                .temperature(0.7)
                .timeout(Duration.ofSeconds(60))
                .build();
    }
} 