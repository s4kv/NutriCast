package com.cs3300g1.backend.controllers;

import java.time.LocalDate;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cs3300g1.backend.services.NutritionService;

/**
 * This class represents a controller that handles all API endpoints for
 * anything related to food macros such as calories, protein, and many more.
 */
@RestController
@RequestMapping("/api/users/{userEmail}/nutrition")
public class NutritionController {
    private NutritionService nutritionService;

    @Autowired
    public NutritionController(NutritionService nutritionService) {
        this.nutritionService = nutritionService;
    }
    
    /**
     * This method gets the user's calories today from the user's email.
     * @param userEmail the user's email.
     * @return the user's calories today matching the user's email.
     */
    @GetMapping("/calories/today")
    public int userCaloriesLoggedToday(@PathVariable("userEmail") String userEmail) {
        return nutritionService.getUserCaloriesLoggedToday(userEmail, LocalDate.now(ZoneId.systemDefault()));
    }

    /**
     * This method gets the user's calorie goal from the user's email.
     * @param userEmail the user's email.
     * @return the user's calorie goal matching the user's email.
     */
    @GetMapping("/calories/goal")
    public int userCalorieGoal(@PathVariable("userEmail") String userEmail) {
        return nutritionService.getUserCalorieGoal(userEmail);
    }

    @PostMapping("/calories/goal")
    public ResponseEntity<Void> editUserCalorieGoal(@PathVariable("userEmail") String email, @RequestBody Integer calorieGoal) {
        nutritionService.setUserCalorieGoal(email, calorieGoal);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
