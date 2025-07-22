package com.cs3300g1.backend.services;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.cs3300g1.backend.models.Food;
import com.cs3300g1.backend.models.FoodLog;
import com.cs3300g1.backend.models.FoodLogDetailsDto;
import com.cs3300g1.backend.models.FoodLogRequest;
import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.repositories.FoodLogRepository;
import com.cs3300g1.backend.repositories.FoodRepository;
import com.cs3300g1.backend.repositories.UserRepository;

/** This class handles all business logic related to Food Logs. */
@Service
public class FoodLogService {
  private final FoodLogRepository foodLogRepository; // responsible for connecting the food_logs collection in mongoDB.
  private final UserRepository userRepository; // responsible for connecting users collection in mongoDB.
  private final FoodRepository foodRepository;

  /**
   * This constructor takes in all arguments.
   *
   * @param foodLogRepository // responsible for connecting the food_logs collection in mongoDB.
   * @param foodRepository // responsible for connecting the foods collection in mongoDB.
   * @param userRepository // responsible for connecting the users collection in mongoDB.
   */
  public FoodLogService(FoodLogRepository foodLogRepository, UserRepository userRepository, FoodRepository foodRepository) {
    this.foodLogRepository = foodLogRepository;
    this.userRepository = userRepository;
    this.foodRepository = foodRepository;
  }

  /**
   * This method saves a Food Log to mongoDB.
   *
   * @param email the email of the user trying to log a Food.
   * @param foodLogRequest the POST information of the Food Log the user wants to save.
   */
  public void saveFoodLog(String userEmail, FoodLogRequest foodLogRequest) {
    // 1. Get the User object from the email to get the userId.
    User user =
        userRepository
            .findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("No user found with the email: " + userEmail));

    // 2. Make the Food Log object and save it to mongoDB.
    //    Convert LocalDate to Instant.
    FoodLog foodLog =
        new FoodLog(
            null,
            user.getId(),
            foodLogRequest.getFoodId(),
            foodLogRequest.getMeal(),
            foodLogRequest.getNoOfServings(),
            Instant.now());
    foodLogRepository.save(foodLog);
  }

  /**
   * This method gets a list of FoodLog objects given the userEmail and today's date.
   *
   * @param userEmail the email of the user.
   * @param timezone the timezone of the user.
   * @return a list of FoodLog objects that matches the gicen userEmail and today's local date.
   */
  public List<FoodLog> getFoodLogsTodayWithUserEmail(String userEmail, String timezone) {
    // 1. Get the User Object from the email to get the userId.
    User user =
        userRepository
            .findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("No user found with the email: " + userEmail));

    // 2. Get the List<FoodLog> of the User for today.
    //    First, we need to convert today's LocalDate to an Instant.
    //    Second, we need to call the findUserFoodLogsForToday method from foodLogRepository.java
    ZoneId currentZoneId = ZoneId.of(timezone);
    LocalDate today = LocalDate.now(currentZoneId);
    Instant start = today.atStartOfDay(currentZoneId).toInstant();
    Instant end = today.plusDays(1).atStartOfDay(currentZoneId).toInstant();
    List<FoodLog> foodLogs = foodLogRepository.findUserFoodLogsForToday(user.getId(), start, end);
    return foodLogs;
  }

  /**
   * This method fetches the food logs and then, for each log,
   * fetches the corresponding food details and combines them.
   * @param userEmail the email of the user.
   * @param timezone  the timezone of the user.
   * @return a list of all the detailed food logs of the user for today.
   */
  public List<FoodLogDetailsDto> getDetailedFoodLogsTodayWithUserEmail(String userEmail, String timezone) {
    // 1. Get the User Object from the email to get the userId.
    User user = userRepository
      .findByEmail(userEmail)
      .orElseThrow(() -> new RuntimeException("No user found with the email: " + userEmail));
    
    // 2. Get all the Food Logs for today.
    List<FoodLog> foodLogs = getFoodLogsTodayWithUserEmail(userEmail, timezone);

    // 3. Create a list for the Detailed Food Logs.
    List<FoodLogDetailsDto> detailedFoodLogs = new ArrayList<>();

    // 4. For each log, find the food details and create the FoodLogDetailsDto object
    //    and add it to the detailedFoodLogs list.
    for (FoodLog foodLog : foodLogs) {
      // 5. Find the Food object using the food id.
      String foodId = foodLog.getFoodId();
      Food food = foodRepository
        .findById(foodId)
        .orElseThrow(() -> new RuntimeException("No food found with the id: " + foodId));

      // 6. Create the FoodLogDetailsDto Object.
      FoodLogDetailsDto detailedFoodLog = new FoodLogDetailsDto(
        foodLog.getId(),
        user.getId(),
        foodId,
        foodLog.getMeal(),
        foodLog.getNoOfServings(),
        foodLog.getTimestamp(),
        food.getName(),
        food.getType(),
        food.getServingSize(),
        food.getServingUnit(),
        food.getMacros()
      );
      detailedFoodLogs.add(detailedFoodLog);
    }
    return detailedFoodLogs;
  }
}
