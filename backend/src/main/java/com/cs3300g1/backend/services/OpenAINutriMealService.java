package com.cs3300g1.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openai.models.chat.completions.StructuredChatCompletion;
import com.openai.client.OpenAIClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletionContentPart;
import com.openai.models.chat.completions.ChatCompletionContentPartImage;
import com.openai.models.chat.completions.ChatCompletionContentPartText;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.chat.completions.StructuredChatCompletionCreateParams;

import com.cs3300g1.backend.models.NutriMealResponse;
import com.cs3300g1.backend.models.NutriMealRequest;

@Service
public class OpenAINutriMealService {

  private final OpenAIClient openAIClient;

  @Autowired
  public OpenAINutriMealService(OpenAIClient openAIClient) {
    this.openAIClient = openAIClient;
  }

  public NutriMealResponse getNutriMealImageResponse(NutriMealRequest prompt) {
    String imageUri = prompt.getImageUri();

    ChatCompletionContentPart imagePart = ChatCompletionContentPart.ofImageUrl(
        ChatCompletionContentPartImage.builder()
            .imageUrl(ChatCompletionContentPartImage.ImageUrl.builder()
                .url(imageUri)
                .build())
            .build());

    ChatCompletionContentPart userMessage = ChatCompletionContentPart
        .ofText(ChatCompletionContentPartText.builder().text(prompt.getUserMessage()).build());

    ChatCompletionContentPart userGoal = ChatCompletionContentPart
        .ofText(ChatCompletionContentPartText.builder().text("This is the desired goal: " + prompt.getGoals()).build());

    ChatCompletionContentPart userMacroDetails = ChatCompletionContentPart
        .ofText(ChatCompletionContentPartText.builder().text("This are the desired macros: " + prompt.getMacroDetails())
            .build());

    StructuredChatCompletionCreateParams<NutriMealResponse> params = ChatCompletionCreateParams.builder()
        .addDeveloperMessage("""
            You are NutriMeal, an expert chef and nutritionist AI. Your task is to create a recipe recommendation.
            1. First, identify the primary edible ingredients from the user-provided image.
            2. Using ONLY the identified ingredients, invent a recipe for a single meal.
            3. The recipe MUST strictly adhere to the user's stated goals (if there are any).
            4. Provide a detailed breakdown of the meal's nutritional macros (calories, protein, fat, carbohydrates).
            5. Include a step-by-step recipe.
            6. Provide an analysis explaining how this meal meets the user's goals.
            7. Format your entire output as a JSON object that strictly conforms to the NutriMealResponse schema.
            """)
        .model(ChatModel.GPT_4_1)
        .responseFormat(NutriMealResponse.class)
        .addUserMessageOfArrayOfContentParts(List.of(userMessage, userGoal, userMacroDetails, imagePart))
        .build();

    StructuredChatCompletion<NutriMealResponse> completition = openAIClient.chat().completions().create(params);

    NutriMealResponse response = completition.choices().get(0).message()
        .content().orElseThrow(() -> new RuntimeException("No response content found"));

    System.out.println("Response from OpenAI: " + response.mealName);

    return response;
  }
}
