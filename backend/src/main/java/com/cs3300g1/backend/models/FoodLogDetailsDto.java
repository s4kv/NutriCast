package com.cs3300g1.backend.models;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * This class represents the combined data I want to send to the dashboard (frontend).
 * 
 * @param foodLogId     Unique identifier for the food log
 * @param userId        The user id which represents the user that logged the food
 * @param foodId        The food id which represents the food that the user logged
 * @param meal          Meal type (e.g., breakfast, lunch, dinner, snack)
 * @param noOfServings  The no of servings the user has decided to log
 * @param timestamp     When the user logged the food
 * @param name          Name of the food        
 * @param type          Type of food (e.g., ITEM, MEAL)
 * @param servingSize   Serving size
 * @param servingUnit   Unit of the serving size (e.g., grams, ounces, cups)
 * @param macros        Nutritional macros of the food
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FoodLogDetailsDto {
    private String foodLogId; 
    private String userId; 
    private String foodId; 
    private Meal meal;
    private double noOfServings;
    private Instant timestamp;
    private String name;
    private FoodType type;
    private double servingSize;
    private String servingUnit;
    private FoodMacros macros;
}
