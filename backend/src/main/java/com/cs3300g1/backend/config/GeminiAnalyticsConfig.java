package com.cs3300g1.backend.config;

import com.google.genai.Client;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiAnalyticsConfig {

  @Bean
  public Client geminiAIClient() {
    return Client.builder().apiKey(System.getenv("GEMINI_API_KEY")).build();
  }
}
