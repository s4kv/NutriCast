package com.cs3300g1.backend.models;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonClassDescription;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
