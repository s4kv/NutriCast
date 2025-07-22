package com.cs3300g1.backend.controllers;

import com.cs3300g1.backend.models.GeminiRequest;
import com.cs3300g1.backend.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gemini/chat")
public class GeminiAnalyticsController {

  private GeminiAnalyticsService client;

  @Autowired
  public void ChatGemniniAI(GeminiAnalyticsService client) {
    this.client = client;
  }

  @PostMapping
  public ResponseEntity<String> chat(@RequestBody GeminiRequest userMessage) {
    try {
      var response = client.getAnalytics(userMessage.userMessage);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(500).body("");
    }
  }
}
