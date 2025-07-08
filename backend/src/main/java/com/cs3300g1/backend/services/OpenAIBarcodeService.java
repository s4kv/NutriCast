// src/main/java/com/cs3300g1/backend/services/OpenAIBarcodeService.java
package com.cs3300g1.backend.services;

import com.cs3300g1.backend.models.FoodMacros;
import com.cs3300g1.backend.models.ScannedFoodItem;
import com.openai.models.chat.completions.StructuredChatCompletion;
import com.openai.client.OpenAIClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletionContentPart;
import com.openai.models.chat.completions.ChatCompletionContentPartText;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.chat.completions.StructuredChatCompletionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpenAIBarcodeService {

    private final OpenAIClient openAIClient;

    @Autowired
    public OpenAIBarcodeService(OpenAIClient openAIClient) {
        this.openAIClient = openAIClient;
    }

    // Now returns ScannedFoodItem, which contains FoodMacros
    public ScannedFoodItem getScannedFoodItemFromBarcode(String barcode) {
        String userMessageContent = createUserMessageForBarcode(barcode);

        ChatCompletionContentPart userMessagePart = ChatCompletionContentPart
                .ofText(ChatCompletionContentPartText.builder().text(userMessageContent).build());

        // Define the parameters for the structured chat completion
        // The response format is now ScannedFoodItem.class
        StructuredChatCompletionCreateParams<ScannedFoodItem> params = ChatCompletionCreateParams.builder()
                // System Message: Instruct OpenAI on its role and desired output format
                .addDeveloperMessage(
                    "You are NutriScan, a nutrition-focused AI assistant. Your task is to identify a food item " +
                    "based on its barcode and provide its estimated nutritional content per typical serving. " +
                    "Respond strictly with the structured data as defined by the response format. " +
                    "Ensure numerical values are integers. " +
                    "If you cannot identify the food, set 'name_of_the_food' to 'Unknown', 'barcode_scanned' to the original barcode, " +
                    "and all nutritional fields within 'nutritional_macros' to 0."
                )
                .model(ChatModel.GPT_4_1) // Use the same model as your other service
                .responseFormat(ScannedFoodItem.class) // <-- IMPORTANT: Target the new wrapper DTO
                .addUserMessageOfArrayOfContentParts(List.of(userMessagePart))
                .build();

        // Send the request to OpenAI
        StructuredChatCompletion<ScannedFoodItem> completion = openAIClient.chat().completions().create(params);

        // Extract the structured content (your ScannedFoodItem object)
        ScannedFoodItem response = completion.choices().get(0).message()
                .content().orElseThrow(() -> new RuntimeException("No structured ScannedFoodItem response content found"));

        // Optional: Ensure the barcode is set, especially if OpenAI might sometimes miss it in the structured output
        if (response.getBarcode() == null) {
            response.setBarcode(barcode);
        }

        System.out.println("Response from OpenAI (ScannedFoodItem): " + response.toString());

        return response;
    }

    private String createUserMessageForBarcode(String barcode) {
        // Updated prompt to ask for specific fields and nested structure
        return "Please identify the food item for barcode: " + barcode + ". " +
               "Provide its name and estimated nutritional macros (calories, protein, carbs, fat, fiber, sugar, sodium, cholesterol) " +
               "in integer grams/milligrams. Ensure the barcode itself is also included in the response.";
    }
}