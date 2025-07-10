package com.cs3300g1.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * This class represents a User trying to request a Food Log to be saved in mongoDB.
 * This class connects the frontend and backend.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FoodLogRequest {
    private String foodId; // The unique identifier of the food that the user wants to log
    private Meal meal; // The type of meal that the user wants to log
    private double noOfServings; // The no of servings that the user wants to log
}
