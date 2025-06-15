package com.cs3300g1.backend.models;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document("nutricast_meal_requests")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NutriMealRequest {
  public String userMessage;
  public String imageUri;
  public String macroDetails;
  public String goals;
}
