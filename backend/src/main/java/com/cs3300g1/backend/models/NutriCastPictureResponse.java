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
@JsonClassDescription("Represents the response from NutriCast for a picture analysis, including the name of the food, its nutritional macros, additional recommendations, and an analysis of the contents of the picture.")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NutriCastPictureResponse {
  @JsonPropertyDescription("The name of the food item identified in the picture.")
  public String name_of_the_food;
  @JsonPropertyDescription("The nutritional macros of the food item, including calories, protein, carbs, fat, fiber, sugar, sodium, and cholesterol.")
  public FoodMacros foodMacros;
  @JsonPropertyDescription("Additional recommendations based on the food item, such as serving suggestions or dietary advice.")
  public String additional_recomendation;
  @JsonPropertyDescription("An analysis of the contents of the picture, providing insights into the food items and their nutritional content.")
  public String analysis_of_contents_of_the_picture;
}
