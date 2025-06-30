package com.cs3300g1.backend.models;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonClassDescription;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * This class represents the nutritional macros of a food item in NutriCast.
 * It includes fields for calories, protein, carbs, fat, fiber, sugar, sodium, and cholesterol.
 * Each of the fields are in grams or milligrams.
 */
@Document("nutricast_picture_requests")
@JsonClassDescription("Represents the nutritional macros of a food item, including calories, protein, carbs, fat, fiber, sugar, sodium, and cholesterol.")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FoodMacros {
  public int calories;
  public int protein;
  public int carbs;
  public int fat;
  public int fiber;
  public int sugar;
  public int sodium;
  public int cholesterol;
}
