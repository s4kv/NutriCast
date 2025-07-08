package com.cs3300g1.backend.controllers;

import com.cs3300g1.backend.models.NutriCastPictureRequest;
import com.cs3300g1.backend.models.NutriCastPictureResponse;
import com.cs3300g1.backend.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatOpenAIController {

  private OpenAIChatService client;

  @Autowired
  public void ChatOpenAI(OpenAIChatService client) {
    this.client = client;
  }

  @PostMapping
  public ResponseEntity<NutriCastPictureResponse> chat(
      @RequestBody NutriCastPictureRequest userMessage) {
    try {
      var response = client.getNutriCastImageResponse(userMessage);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(500).body(new NutriCastPictureResponse());
    }
  }
}
