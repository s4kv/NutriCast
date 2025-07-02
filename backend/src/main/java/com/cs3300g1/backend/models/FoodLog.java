package com.cs3300g1.backend.models;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * This class represents a food that has been logged by a user.
 * This class will include a unique id, user id which represents the user that logged the food,
 * food id which represents the food that the user logged, number of servings, and the time when the
 * user logged the food.
 */
@Document("food_logs")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FoodLog {
    @Id
    @ToString.Exclude private String id; // Unique id to identify the food log
    private String userId; // The user id which represents the user that logged the food
    private String foodId; // The food id which represents the food that the user logged
    private Meal meal; // Meal type (e.g., breakfast, lunch, dinner, snack)
    private double noOfServings; // The no of servings the user has decided to log
    private Instant timestamp; // When the user logged the food
}
