package com.cs3300g1.backend.models;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;

// should we track only these? or should we add more? 
//

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

@Document("nutricast_pictures_response")
@JsonClassDescription("Provides a detailed nutritional analysis of a food item from an image. The model should identify the food, estimate its complete macronutrient profile, and offer dietary insights based on a user's prompt.")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NutriCastPictureResponse {

  @JsonPropertyDescription("A descriptive name for the primary food item or meal identified in the image. Example: 'Grilled Chicken Salad with Avocado'.")
  public String name_of_the_food;

  @JsonPropertyDescription("Estimated total calories for the portion shown in the image, as a whole number.")
  public int calories;

  @JsonPropertyDescription("Estimated grams (g) of protein for the portion shown, as a whole number.")
  public int protein;

  @JsonPropertyDescription("Estimated grams (g) of total carbohydrates for the portion shown, as a whole number.")
  public int carbs;

  @JsonPropertyDescription("Estimated grams (g) of total fat for the portion shown, as a whole number.")
  public int fat;

  @JsonPropertyDescription("Estimated grams (g) of dietary fiber for the portion shown, as a whole number.")
  public int fiber;

  @JsonPropertyDescription("Estimated grams (g) of sugar for the portion shown, as a whole number.")
  public int sugar;

  @JsonPropertyDescription("Estimated milligrams (mg) of sodium for the portion shown, as a whole number.")
  public int sodium;

  @JsonPropertyDescription("Estimated milligrams (mg) of cholesterol for the portion shown, as a whole number.")
  public int cholesterol;

  @JsonPropertyDescription("A list of actionable dietary advice or serving suggestions related to the meal. Should be a single string with recommendations separated by newlines. Example: 'This is a high-protein meal. To add healthy fats, consider a handful of nuts.'")
  public String additional_recommendation;

  @JsonPropertyDescription("A direct and concise answer to the user's custom prompt. This field must specifically address the user's question or instruction about the food.")
  public String prompt_response;

  @JsonPropertyDescription("A brief paragraph analyzing the meal's composition and nutritional value. Mention key ingredients identified and their contribution to the overall macros. Example: 'This meal appears to be a balanced mix of lean protein from the chicken and healthy fats from the avocado...'")
  public String analysis_of_contents_of_the_picture;
}
