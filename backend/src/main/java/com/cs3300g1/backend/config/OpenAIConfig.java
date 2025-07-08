package com.cs3300g1.backend.config;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAIConfig {

  @Bean
  public OpenAIClient openAIClient() {
    return new OpenAIOkHttpClient.Builder()
        .apiKey(System.getenv("OPENAI_API_KEY")) // Ensure you set this environment variable
        .build();
  }
}
