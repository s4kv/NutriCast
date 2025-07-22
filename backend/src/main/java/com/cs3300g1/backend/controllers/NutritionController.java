package com.cs3300g1.backend.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cs3300g1.backend.services.NutritionService;

/**
 * This class represents a controller that handles all API endpoints for anything related to food
 * macros such as calories, protein, and many more.
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
   * This method gets the user's nutrition today from the user's email.
   *
   * @param userEmail the user's email.
   * @return the user's nutrition today matching the user's email.
   */
  @GetMapping("/today")
  public ResponseEntity<Map<String, Double>> userCaloriesLoggedToday(
    @PathVariable("userEmail") String userEmail,
    @RequestHeader("X-User-Time-Zone") String timezone
  ) {
    Map<String, Double> nutritionLoggedToday = nutritionService.getUserNutritionLoggedToday(userEmail, timezone);
    return ResponseEntity.ok(nutritionLoggedToday);
  }

  /**
   * This method gets the user's nutrition goal from the user's email.
   *
   * @param userEmail the user's email.
   * @return the user's nutrition goal matching the user's email.
   */
  @GetMapping("/goal")
  public ResponseEntity<Map<String, Integer>> userNutritionGoal(@PathVariable("userEmail") String userEmail) {
    Map<String, Integer> nutritionGoals = nutritionService.getUserNutritionGoal(userEmail);
    return ResponseEntity.ok(nutritionGoals);
  }

  @PostMapping("/{nutrition}/goal")
  public ResponseEntity<Void> editUserCalorieGoal(
    @PathVariable("userEmail") String email,
    @PathVariable("nutrition") String nutrition,
    @RequestBody Integer nutritionGoal
  ) {
    nutritionService.setUserCalorieGoal(email, nutrition, nutritionGoal);
    return new ResponseEntity<>(HttpStatus.OK);
  }
}
