package com.cs3300g1.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.client.OpenAIClient;

@Configuration
public class OpenAIConfig {

  @Bean
  public OpenAIClient openAIClient() {
    return new OpenAIOkHttpClient.Builder()
        .apiKey(System.getenv("OPENAI_API_KEY")) // Ensure you set this environment variable
        .build();
  }
}
