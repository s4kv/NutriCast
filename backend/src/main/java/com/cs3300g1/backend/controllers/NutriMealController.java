package com.cs3300g1.backend.controllers;

import com.cs3300g1.backend.models.NutriMealRequest;
import com.cs3300g1.backend.models.NutriMealResponse;
import com.cs3300g1.backend.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/nutri-meal")
public class NutriMealController {

  private OpenAINutriMealService client;

  @Autowired
  public void ChatOpenAI(OpenAINutriMealService client) {
    this.client = client;
  }

  @PostMapping
  public ResponseEntity<NutriMealResponse> chat(@RequestBody NutriMealRequest userMessage) {
    try {
      var response = client.getNutriMealImageResponse(userMessage);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(500).body(new NutriMealResponse());
    }
  }
}
