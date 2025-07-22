package com.cs3300g1.backend.services;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GeminiAnalyticsService {

  private final Client geminiAIClient;

  //
  @Autowired
  public GeminiAnalyticsService(Client geminiClient) {
    this.geminiAIClient = geminiClient;
  }

  public String getAnalytics(String prompt) {
    Content sys_prompt =
        Content.fromParts(
            Part.fromText(
                "You are an analytics assistent for a nutrition app called NutriCast. Your task is"
                    + " to analyze the user's input and provide insights based on the data"
                    + " provided. You will receive a prompt from the user, and you should respond"
                    + " with relevant analytics information. Do not use any Markdown syntax because"
                    + " is not supported, just plain text."));

    GenerateContentConfig config =
        GenerateContentConfig.builder().systemInstruction(sys_prompt).build();

    GenerateContentResponse response =
        geminiAIClient.models.generateContent("gemini-2.0-flash-001", prompt, config);

    return response.text();
  }
}
