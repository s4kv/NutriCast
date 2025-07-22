package com.cs3300g1.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cs3300g1.backend.models.FoodLog;
import com.cs3300g1.backend.models.FoodLogDetailsDto;
import com.cs3300g1.backend.models.FoodLogRequest;
import com.cs3300g1.backend.services.FoodLogService;

/**
 * This class represents a controller that handles all API endpoints
 * related to Food Logs.
 */
@RestController
@RequestMapping("/api/users/{userEmail}/foods/logs")
public class FoodLogController {
    private FoodLogService foodLogService; // handles all the business logic related to Food Logs.

    /**
     * This constuctor takes in all arguments.
     * @param foodLogService handles all the business logic related to Food Logs.
     */
    public FoodLogController(FoodLogService foodLogService) {
        this.foodLogService = foodLogService;
    }

    /**
     * This method POST all the Food Log information the user wants to add.
     * @param userEmail the email of the user.
     * @param foodLogRequest the FoodLog object the user is requesting to log.
     * @return a ResponseEntity status.
     */
    @PostMapping("/{foodId}")
    public ResponseEntity<Void> postFoodLog(@PathVariable("userEmail") String userEmail, @RequestBody FoodLogRequest foodLogRequest) {
        foodLogService.saveFoodLog(userEmail, foodLogRequest);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }


    /**
     * This method gets all the Food Log objects the user logged today.
     * @param userEmail the email of the user.
     * @return a list of all Food Log objects that matches the userEmail
     *         and a ResponseEntity status.
     */
    @GetMapping("/today")
    public ResponseEntity<List<FoodLog>> getFoodLogToday(@PathVariable("userEmail") String userEmail) {
        List<FoodLog> foodLogs = foodLogService.getFoodLogsTodayWithUserEmail(userEmail);
        return new ResponseEntity<>(foodLogs, HttpStatus.OK);
    }

    /**
     * This method gets all the FoodLogDetailsDto objects the user logged today.
     * @param userEmail the email of the user.
     * @return a list of all the detailed food log objects that macthes the userEmail
     *         and a ResponseEntity status.
     */
    @GetMapping("/today/details")
    public ResponseEntity<List<FoodLogDetailsDto>> getDetailedFoodLogsToday(@PathVariable("userEmail") String userEmail) {
        List<FoodLogDetailsDto> detailedFoodLogs = foodLogService.getDetailedFoodLogsTodayWithUserEmail(userEmail);
        return new ResponseEntity<>(detailedFoodLogs, HttpStatus.OK);
    }
}
