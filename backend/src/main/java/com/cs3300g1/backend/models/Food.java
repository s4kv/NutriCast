package com.cs3300g1.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * This class represents a Food in NutriCast.
 *
 * <p>A Food can be a single food item or a meal. For example, a single food item could be a chicken
 * breast or water, a meal could be a chicken breast with rice and broccoli or a protein shake,
 * which consists of water and protein powder.
 *
 * <p>A user can log this food in their food log, which is represented by the FoodLog model.
 */
@Document("foods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Food {
  @Id @ToString.Exclude private String id; // Unique identifier for the food item
  private String name; // Name of the food
  private FoodType type; // Type of food (e.g., ITEM, MEAL)
  private double servingSize; // Serving size
  private String servingUnit; // Unit of the serving size (e.g., grams, ounces, cups)
  private FoodMacros macros; // Nutritional macros of the food
}
