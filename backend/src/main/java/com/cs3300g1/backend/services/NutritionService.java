package com.cs3300g1.backend.services;

import com.cs3300g1.backend.models.Food;
import com.cs3300g1.backend.models.FoodLog;
import com.cs3300g1.backend.models.FoodMacros;
import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.repositories.FoodLogRepository;
import com.cs3300g1.backend.repositories.FoodRepository;
import com.cs3300g1.backend.repositories.UserRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * This class handles all the business logic related to Nutrition. Nutrition including calories,
 * protein, carbohydrates, and other food macros. For example, this service could get the number of
 * calories logged by an user today.
 */
@Service
public class NutritionService {
  private final UserRepository
      userRepository; // responsible for connecting the users collection in mongodb
  private final FoodRepository
      foodRepository; // responsible for connecting the foods collection in mongodb
  private final FoodLogRepository
      foodLogRepository; // responsible for connecting the foods_log collection in mongodb

  /**
   * This constructor takes in all arguments.
   *
   * @param userRepository responsible for connecting the users collection in mongodb.
   * @param foodRepository responsible for connecting the foods collection in mongodb.
   * @param foodLogRepository resposnible for connecting the foods_log collection in mongodb.
   */
  @Autowired
  public NutritionService(
      UserRepository userRepository,
      FoodRepository foodRepository,
      FoodLogRepository foodLogRepository) {
    this.userRepository = userRepository;
    this.foodRepository = foodRepository;
    this.foodLogRepository = foodLogRepository;
  }

  /**
   * This method gets the number of nutrition logged by an user today.
   *
   * @param userEmail the email of the user.
   * @param timezone the timezone when the user logged the food.
   * @return the number of nutrition logged by the user today.
   */
  public Map<String, Double> getUserNutritionLoggedToday(String userEmail, String timezone) {
    // 1. Get the User from userEmail in MongoDB.
    //    If User is found, then proceed with the calculation.
    //    If User is not found, then don't proceed with the calculation and generate an runtime error.
    //    Though, 99% of the time, the user should be found since only users can log meals.
    User user = userRepository.findByEmail(userEmail)
                  .orElseThrow(() -> new RuntimeException("No user was found with the email: " + userEmail));

    // 2. Get the List<FoodLog> of the user for today.
    //    First, we need to convert the LocalDate to Instant.
    //    Second, we use findUserFoodLogsForToday from foodLogRepository.
    ZoneId currentZoneId = ZoneId.of(timezone);
    LocalDate today = LocalDate.now(currentZoneId);
    Instant start = today.atStartOfDay(currentZoneId).toInstant();
    Instant end = today.plusDays(1).atStartOfDay(currentZoneId).toInstant();
    List<FoodLog> userFoodLogsForToday = foodLogRepository.findUserFoodLogsForToday(user.getId(), start, end);

    // 3. Go through userFoodLogsForToday and get the total amount of nutrition logged by the user.
    //    For each FoodLog in List<FoodLog>, get the Food that is related to that FoodLog.
    //    Get the macros of the Food and then multiply it by the number of servings from FoodLog.
    Map<String, Double> nutritionLoggedToday = new HashMap<>();
    nutritionLoggedToday.put("calorie", 0.0);
    nutritionLoggedToday.put("protein", 0.0);
    nutritionLoggedToday.put("carbs", 0.0);
    nutritionLoggedToday.put("fat", 0.0);

    for (FoodLog userFoodLogForToday : userFoodLogsForToday) {
      String foodId = userFoodLogForToday.getFoodId();
      Food food =foodRepository.findById(foodId)
                  .orElseThrow(() -> new RuntimeException("No food cannot be found in the database with this id: " + foodId));
      FoodMacros foodMacros = food.getMacros();
      Double noOfServings = userFoodLogForToday.getNoOfServings();
      nutritionLoggedToday.compute("calorie", (key, val) ->  val + foodMacros.getCalories() * noOfServings);
      nutritionLoggedToday.compute("protein", (key, val) ->  val + foodMacros.getProtein() * noOfServings);
      nutritionLoggedToday.compute("carbs", (key, val) ->  val + foodMacros.getCarbs() * noOfServings);
      nutritionLoggedToday.compute("fat", (key, val) ->  val + foodMacros.getFat() * noOfServings);
    }
    return nutritionLoggedToday;
  }

  /**
   * This method gets the user's nutrition goal from the database.
   *
   * @param userEmail the user's email.
   * @return the user's nutrition goal matching the user's email.
   */
  public Map<String, Integer> getUserNutritionGoal(String userEmail) {
    // 1. Get the user from userEmail in mongoDB.
    User user =
        userRepository
            .findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("No user found with the email: " + userEmail));

    // 2. Get the user's nutritioon goal and return it.
    Map<String, Integer> nutritionGoals = new HashMap<>();
    nutritionGoals.put("calorie", user.getCalorieGoal());
    nutritionGoals.put("protein", user.getProteinGoal());
    nutritionGoals.put("carbs", user.getCarbGoal());
    nutritionGoals.put("fat", user.getFatGoal());
    return nutritionGoals;
  }

  /**
   * This method sets the user's nutrition goal to a new value and saves it in mongoDB.
   *
   * @param userCalorieGoal the new value of the user's nutrition goal.
   */
  public void setUserCalorieGoal(String email, String nutrition, Integer nutritionGoal) {
    // 1. Find the user in the database from the email.
    User user =
        userRepository
            .findByEmail(email)
            .orElseThrow(() -> new RuntimeException("No users that match the email: " + email));

    // 2. Edit the user's nutrition goal with the new nutrition goal and save the user to mongoDB.
    switch (nutrition) {
      case "calorie":
        user.setCalorieGoal((int) nutritionGoal);
        break;
      case "protein":
        user.setProteinGoal((int) nutritionGoal);
        break;
      case "carbs":
        user.setCarbGoal((int) nutritionGoal);
        break;
      case "fat":
        user.setFatGoal((int) nutritionGoal);
        break;
      default:
        throw new IllegalArgumentException("Invalid nutrition provided: " + nutrition);
    }
    userRepository.save(user);
  }
}
