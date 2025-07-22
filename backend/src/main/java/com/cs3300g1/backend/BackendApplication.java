package com.cs3300g1.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.cs3300g1.backend.repositories.FoodLogRepository;
import com.cs3300g1.backend.repositories.FoodRepository;
import com.cs3300g1.backend.repositories.UserRepository;

@SpringBootApplication
@EnableMongoRepositories
public class BackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(BackendApplication.class, args);
  }

  /**
   * This is used to test the connection between Springboot and MongoDB.
   */
  @Bean
  CommandLineRunner testBackendAndDatabase(FoodRepository foods, UserRepository users,
  FoodLogRepository foodLogs) {
    return args -> {
    };
  }
}
