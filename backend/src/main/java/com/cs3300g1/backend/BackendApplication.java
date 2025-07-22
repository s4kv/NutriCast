package com.cs3300g1.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.cs3300g1.backend.repositories.FoodLogRepository;
import com.cs3300g1.backend.repositories.FoodRepository;
import com.cs3300g1.backend.repositories.UserRepository;
import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.models.Food;
import com.cs3300g1.backend.models.FoodLog;
import com.cs3300g1.backend.models.FoodMacros;
import com.cs3300g1.backend.models.FoodType;
import com.cs3300g1.backend.models.Meal;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

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
      // -----------------------------------------------------------
      // Testing new user making a user account, adding a food that they are going to eat, and then log it.

      // // Make a user and add it to the database.
      // User user = new User(null, "test", null, "test@test.com", 0, new ArrayList<>(), new ArrayList<>());
      // users.save(user);

      // // Test UserRepository to see if the methods work.
      // User findByUsername = users.findByUsername("test")
      //   .orElseThrow(() -> new RuntimeException("No users with that username."));
      // User findByEmail = users.findByEmail("test@test.com")
      //   .orElseThrow(() -> new RuntimeException("No users with that email."));

      // User findByAuthUid = users.findByAuthUid("01MUBODLTDQdI65u4sONLiDFcBy1")
      //   .orElseThrow(() -> new RuntimeException("No users with that email."));

      //   System.out.println(findByAuthUid);
      // System.out.println("findByUsername: " + findByUsername);
      // System.out.println("findByEmail: " + findByEmail);

      // Make a food.
      // FoodMacros foodMacros = new FoodMacros(280, 53, 0, 6, 0, 0, 70, 140);
      // Food food = new Food(null, findByUsername.getId(), "Chicken Breast", FoodType.ITEM, 100, "grams", foodMacros);
      // foods.save(food);

      // // // Test FoodRepository to see if the methods work.
      // List<Food> findByName = foods.findByName("Chicken Breast");
      // List<Food> findByType = foods.findByType(FoodType.ITEM);
      // List<Food> findByUserIdAndFoods = foods.findByUserIdAndName(findByUsername.getId(), "Chicken Breast");
      // List<Food> foodsFindByUserId = foods.findByUserId(findByUsername.getId());
      // // System.out.println("findByName: " + findByName);
      // // System.out.println("findByType: " + findByType);
      // // System.out.println("findByUserIdAndFoods" + findByUserIdAndFoods);
      // // System.out.println("foodsFindByUserId: " + foodsFindByUserId);
      // Food chickenBreast = findByName.get(0);

      // // User logs a food.
      // User findById = users.findById(findByUsername.getId())
      //   .orElseThrow(() -> new RuntimeException("No users with that user id,"));

      // // Instant foodLoggedAt = Instant.now();
      // // ZonedDateTime foodLoggedAtLocalTime = foodLoggedAt.atZone(ZoneId.systemDefault());
      // // System.out.println("foodLoggedAt: " + foodLoggedAt);
      // // System.out.println("foodLoggedAtLocalTime: " + foodLoggedAtLocalTime);

      // // FoodLog foodLog = new FoodLog(null, findById.getId(), chickenBreast.getId(), Meal.LUNCH, 1, Instant.now());
      // // foodLogs.save(foodLog);
      // // findById.getFoodLogs().add(foodLog);
      // // findById.setFoodLogs(findById.getFoodLogs());
      // // users.save(findById);

      // // Testing FoodLogRepository methods
      // List<FoodLog> findByUserId = foodLogs.findByUserId(findById.getId());
      // List<FoodLog> findByFoodId = foodLogs.findByFoodId(chickenBreast.getId());
      // List<FoodLog> findByMeal = foodLogs.findByMeal(Meal.LUNCH);
      // // System.out.println("findByUserId: " + findByUserId);
      // // System.out.println("findByFoodId: " + findByFoodId);
      // // System.out.println("findByMeal: " + findByMeal);
      // LocalDate today = LocalDate.now(ZoneId.systemDefault());
      // Instant startOfDay = today
      //   .atStartOfDay(ZoneId.systemDefault())
      //   .toInstant();
      // Instant endOfDay = today
      //   .plusDays(1)
      //   .atStartOfDay(ZoneId.systemDefault())
      //   .toInstant();
      // // System.out.println("startOfDay: " + startOfDay);
      // // System.out.println("endOfDay: " + endOfDay);
      // ZonedDateTime startOfDayAtLocalTime = startOfDay.atZone(ZoneId.systemDefault());
      // ZonedDateTime endOfDayAtLocalTime = endOfDay.atZone(ZoneId.systemDefault());
      // // System.out.println("startOfDayAtLocalTime: " + startOfDayAtLocalTime);
      // // System.out.println("endOfDayAtLocalTime: " + endOfDayAtLocalTime);
      // List<FoodLog> findUserFoodLogsForToday = foodLogs.findUserFoodLogsForToday(findById.getId(), startOfDay, endOfDay);
      // // System.out.println("findUserFoodLogsForToday: " + findUserFoodLogsForToday);
      // ----------------------------------------------------------
    };
  }
}
