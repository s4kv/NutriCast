package com.cs3300g1.backend.models;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

// nutrimeal: given a picture of a meal, return a meal recipe that contains the contents of the picture, and nutritional macros of the meal
@Document("nutricast_meal_responses")
@JsonClassDescription("Represents a complete meal recommendation. This is a flat structure containing a meal name, ingredients, instructions, a full nutritional breakdown, and an analysis.")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NutriMealResponse {
  @JsonPropertyDescription("A creative and descriptive name for the recommended meal (e.g., 'Mediterranean Quinoa Salad').")
  public String mealName;

  @JsonPropertyDescription("A list of all ingredients required for the meal, with specific quantities (e.g., ['1 cup of chopped carrots', '2 tbsp of olive oil']).")
  public List<String> ingredients;

  @JsonPropertyDescription("A list of the step-by-step preparation and cooking instructions.")
  public List<String> instructions;

  @JsonPropertyDescription("Total calories of the meal, as an integer.")
  public int calories;

  @JsonPropertyDescription("Total grams of protein in the meal. Can be a decimal value.")
  public double proteinInGrams;

  @JsonPropertyDescription("Total grams of carbohydrates in the meal.")
  public double carbsInGrams;

  @JsonPropertyDescription("Total grams of fat in the meal.")
  public double fatInGrams;

  @JsonPropertyDescription("Total grams of fiber in the meal.")
  public double fiberInGrams;

  @JsonPropertyDescription("Total grams of sugar in the meal.")
  public double sugarInGrams;

  @JsonPropertyDescription("Total milligrams of sodium in the meal.")
  public int sodiumInMg;

  @JsonPropertyDescription("An analysis explaining how this meal recommendation meets the user's specific dietary goals. This should justify the recipe choice.")
  public String mealAnalysis;

  @JsonPropertyDescription("A list of additional tips or serving suggestions for the meal (e.g., ['Pairs well with a side salad', 'Garnish with fresh cilantro']).")
  public List<String> servingSuggestions;
}
