package com.cs3300g1.backend.services;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import org.springframework.stereotype.Service;

import com.cs3300g1.backend.models.FoodLog;
import com.cs3300g1.backend.models.FoodLogRequest;
import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.repositories.FoodLogRepository;
import com.cs3300g1.backend.repositories.UserRepository;

/**
 * This class handles all business logic related to Food Logs.
 */
@Service
public class FoodLogService {
    private final FoodLogRepository foodLogRepository; // responsible for connecting the food_logs collection in mongoDB.
    private final UserRepository userRepository; // responsible for connecting users collection in mongoDB.


    /**
     * This constructor takes in all arguments.
     * @param foodLogRepository // responsible for connecting the food_logs collection in mongoDB.
     * @param foodRepository // responsible for connecting the foods collection in mongoDB.
     * @param userRepository // responsible for connecting the users collection in mongoDB.
     */
    public FoodLogService(FoodLogRepository foodLogRepository, UserRepository userRepository) {
        this.foodLogRepository = foodLogRepository;
        this.userRepository = userRepository;
    }

    /**
     * This method saves a Food Log to mongoDB.
     * @param email the email of the user trying to log a Food.
     * @param foodLogRequest the POST information of the Food Log the user wants to save.
     */
    public void saveFoodLog(String userEmail, FoodLogRequest foodLogRequest) {
        // 1. Get the User object from the email to get the userId.
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("No user found with the email: " + userEmail));
        
        // 2. Make the Food Log object and save it to mongoDB.
        //    Convert LocalDate to Instant.
        FoodLog foodLog = new FoodLog(null, user.getId(), foodLogRequest.getFoodId(), foodLogRequest.getMeal(), foodLogRequest.getNoOfServings(), Instant.now());
        foodLogRepository.save(foodLog);
    }


    /**
     * This method gets a list of FoodLog objects given the userEmail and today's date.
     * @param userEmail the email of the user.
     * @param today the local date of today.
     * @return a list of FoodLog objects that matches the gicen userEmail and today's local date.
     */
    public List<FoodLog> getFoodLogsTodayWithUserEmail(String userEmail, LocalDate today) {
        // 1. Get the User Object from the email to get the userId.
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("No user found with the email: " + userEmail));
        
        // 2. Get the List<FoodLog> of the User for today.
        //    First, we need to convert today's LocalDate to an Instant.
        //    Second, we need to call the findUserFoodLogsForToday method from foodLogRepository.java
        Instant start = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant end = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        List<FoodLog> foodLogs = foodLogRepository.findUserFoodLogsForToday(user.getId(), start, end);
        return foodLogs;
    }
}
