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

import com.cs3300g1.backend.models.NutriCastPictureRequest;
import com.cs3300g1.backend.models.NutriCastPictureResponse;

@Service
public class OpenAIChatService {

  private final OpenAIClient openAIClient;

  @Autowired
  public OpenAIChatService(OpenAIClient openAIClient) {
    this.openAIClient = openAIClient;
  }

  // another key idea here: wrap this in anohter method to log into database
  public NutriCastPictureResponse getNutriCastImageResponse(NutriCastPictureRequest prompt) {
    String imageUri = prompt.getImageUri();

    ChatCompletionContentPart imagePart = ChatCompletionContentPart.ofImageUrl(
        ChatCompletionContentPartImage.builder()
            .imageUrl(ChatCompletionContentPartImage.ImageUrl.builder()
                .url(imageUri)
                .build())
            .build());

    ChatCompletionContentPart userMessage = ChatCompletionContentPart
        .ofText(ChatCompletionContentPartText.builder().text(prompt.getUserMessage()).build());

    StructuredChatCompletionCreateParams<NutriCastPictureResponse> params = ChatCompletionCreateParams.builder()
        .addDeveloperMessage(
            "You are NutriCast, a nutrition-focused AI assistant. Your task is to analyze the image an provide a detailed description of the food items, their nutritional content, and any relevant dietary information.")
        .model(ChatModel.GPT_4_1)
        .responseFormat(NutriCastPictureResponse.class)
        .addUserMessageOfArrayOfContentParts(List.of(userMessage, imagePart))
        .build();

    StructuredChatCompletion<NutriCastPictureResponse> completition = openAIClient.chat().completions().create(params);

    NutriCastPictureResponse response = completition.choices().get(0).message()
        .content().orElseThrow(() -> new RuntimeException("No response content found"));

    System.out.println("Response from OpenAI: " + response.name_of_the_food);

    return response;
  }
}
