package com.cs3300g1.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * This class represents a Food's information when a User wants to add a Food.
 * This class connects the frontend and backend.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FoodRequest {
    private String name; // the name of the food
    private FoodType type; // the type of the food (e.g, ITEM, MEAL)
    private double servingSize; // the serving size of the food (e.g, 100)
    private String servingUnit; // the unit of the serving size of the food (e.g, grams)
    private FoodMacros foodMacros; // the nutritional information of the food
}
