package com.cs3300g1.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.cs3300g1.backend.repositories.FoodRepository;
import com.cs3300g1.backend.repositories.UserRepository;
import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.models.Food;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
  CommandLineRunner testBackendAndDatabase(FoodRepository foods, UserRepository users) {
    return args -> {
      User user = users.findByEmail("test@test.com")
        .orElseThrow(() -> new RuntimeException("User not found"));
      Food food = foods.findById(user.getLoggedFoodIds().get(0))
        .orElseThrow(() -> new RuntimeException("Food not found"));
      System.out.println("food: " + food.getName() + ", calories: " + food.getMacros().getCalories());
    };
  }
}
