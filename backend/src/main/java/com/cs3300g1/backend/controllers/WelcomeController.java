package com.cs3300g1.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {

  @GetMapping("/welcome")
  public String welcome() {
    return "Welcome to the CS3300G1 Backend Application from SpringBoot!";
  }
}
