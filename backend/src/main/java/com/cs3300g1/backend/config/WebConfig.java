/**
 * Enables CORS in Spring Boot. This configuration allows the React Native app to call the Spring
 * Boot backend.
 */
package com.cs3300g1.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry
        .addMapping("/**")
        .allowedOrigins("*") // React Native app URL, * means allow requests from any origin
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
  }
}
