package com.cs3300g1.backend.models;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * This class represents the nutritional macros of a food item in NutriCast. It includes fields for
 * calories, protein, carbs, fat, fiber, sugar, sodium, and cholesterol. Each of the fields are in
 * grams or milligrams.
 */
@JsonClassDescription(
    "Represents the nutritional macros of a food item, including calories, protein, carbs, fat,"
        + " fiber, sugar, sodium, and cholesterol.")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FoodMacros {
  private int calories; // kcal
  private int protein; // g
  private int carbs; // g
  private int fat; // g
  private int fiber; // g
  private int sugar; // g
  private int sodium; // mg
  private int cholesterol; // mg
}
