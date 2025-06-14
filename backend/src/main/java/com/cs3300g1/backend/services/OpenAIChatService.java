package com.cs3300g1.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    String base64Url = prompt.getBase64Image();

    ChatCompletionContentPart imagePart = ChatCompletionContentPart.ofImageUrl(
        ChatCompletionContentPartImage.builder()
            .imageUrl(ChatCompletionContentPartImage.ImageUrl.builder()
                .url(base64Url)
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

    var completition = openAIClient.chat().completions().create(params);

    NutriCastPictureResponse response = completition.responseType().cast(NutriCastPictureResponse.class);

    if (response == null) {
      throw new RuntimeException("Failed to get a valid response from OpenAI.");
    }

    System.out.println("Response from OpenAI: " + response);

    return response;
  }
}
