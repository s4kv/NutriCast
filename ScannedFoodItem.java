// src/main/java/com/cs3300g1/backend/models/ScannedFoodItem.java
package com.cs3300g1.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * This class represents a food item identified by barcode,
 * including its name and detailed nutritional macros.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ScannedFoodItem {

    @JsonProperty("name_of_the_food") // Field name expected from OpenAI
    private String name;

    @JsonProperty("barcode_scanned") // Field name expected from OpenAI
    private String barcode;

    // This will map the nested JSON object from OpenAI to your FoodMacros class
    @JsonProperty("nutritional_macros") // A descriptive name for the nested macros object
    private FoodMacros nutritionalMacros;

    // Optionally, for logging/debugging:
    @Override
    public String toString() {
        return "ScannedFoodItem{" +
               "name='" + name + '\'' +
               ", barcode='" + barcode + '\'' +
               ", nutritionalMacros=" + nutritionalMacros +
               '}';
    }
}