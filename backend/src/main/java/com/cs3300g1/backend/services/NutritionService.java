package com.cs3300g1.backend.services;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cs3300g1.backend.models.Food;
import com.cs3300g1.backend.models.FoodLog;
import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.repositories.FoodLogRepository;
import com.cs3300g1.backend.repositories.FoodRepository;
import com.cs3300g1.backend.repositories.UserRepository;

/**
 * This class handles all the business logic related to Nutrition.
 * Nutrition including calories, protein, carbohydrates, and other food macros.
 * For example, this service could get the number of calories logged by an user today.
 */
@Service
public class NutritionService {
    private final UserRepository userRepository; // responsible for connecting the users collection in mongodb
    private final FoodRepository foodRepository; // responsible for connecting the foods collection in mongodb
    private final FoodLogRepository foodLogRepository; // responsible for connecting the foods_log collection in mongodb

    /**
     * This constructor takes in all arguments.
     * @param userRepository responsible for connecting the users collection in mongodb.
     * @param foodRepository responsible for connecting the foods collection in mongodb.
     * @param foodLogRepository resposnible for connecting the foods_log collection in mongodb.
     */
    @Autowired
    public NutritionService(UserRepository userRepository, FoodRepository foodRepository, FoodLogRepository foodLogRepository) {
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
        this.foodLogRepository = foodLogRepository;
    }

    /**
     * This method gets the number of calories logged by an user today.
     * @param userEmail the email of the user.
     * @param date      when the user logged the food.
     * @return the number of calories logged by the user today.
     */
    public int getUserCaloriesLoggedToday(String userEmail, LocalDate today) {
        // 1. Get the User from userEmail in MongoDB.
        //    If User is found, then proceed with the calculation.
        //    If User is not found, then don't proceed with the calculation and generate an runtime error.
        //    Though, 99% of the time, the user should be found since only users can log meals.
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("No user was found with the email: " + userEmail));

        // 2. Get the List<FoodLog> of the user for today.
        //    First, we need to convert the LocalDate to Instant.
        //    Second, we use findUserFoodLogsForToday from foodLogRepository.
        Instant start = today
            .atStartOfDay(ZoneId.systemDefault())
            .toInstant();
        Instant end = today
            .plusDays(1)
            .atStartOfDay(ZoneId.systemDefault())
            .toInstant();
        List<FoodLog> userFoodLogsForToday = foodLogRepository.findUserFoodLogsForToday(user.getId(), start, end);

        // 3. Go through userFoodLogsForToday and get the total amount of calories logged by the user.
        //    For each FoodLog in List<FoodLog>, get the Food that is related to that FoodLog.
        //    Get the macros of the Food and then multiply it by the number of servings from FoodLog.
        int caloriesLoggedToday = 0;
        for (FoodLog userFoodLogForToday : userFoodLogsForToday) {
            String foodId = userFoodLogForToday.getFoodId();
            Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("No food cannot be found in the database with this id: " + foodId));
            caloriesLoggedToday += food.getMacros().getCalories() * userFoodLogForToday.getNoOfServings();
        }
        return caloriesLoggedToday;
    }

    /**
     * This method gets the user's calorie goal from the database.
     * @param userEmail the user's email.
     * @return the user's calorie goal matching the user's email.
     */
    public int getUserCalorieGoal(String userEmail) {
        // 1. Get the user from userEmail in mongoDB.
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("No user found with the email: " + userEmail));
        
        // 2. Get the user's calorie goal and return it.
        return user.getCalorieGoal();
    }
}
