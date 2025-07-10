package com.cs3300g1.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cs3300g1.backend.models.Food;
import com.cs3300g1.backend.models.FoodRequest;
import com.cs3300g1.backend.services.FoodService;

/**
 * This class represents a controller that handles all API endpoints
 * for anything related to Food.
 */
@RestController
@RequestMapping("/api/users/{userEmail}/foods")
public class FoodController {
    private FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    /**
     * This method posts the Food object the user requests to create.
     * @param userEmail the email of the user.
     * @param foodRequest the Food object the user is requesting to create.
     * @return a ResponseEntity status.
     */
    @PostMapping
    public ResponseEntity<Void> postUserFood(@PathVariable("userEmail") String userEmail, @RequestBody FoodRequest foodRequest) {
        foodService.saveFood(userEmail, foodRequest);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{name}")
    public ResponseEntity<List<Food>> getUserFood(@PathVariable("userEmail") String userEmail, @PathVariable("name") String name) {
        List<Food> foods = foodService.getFoodsWithUserEmailAndName(userEmail, name);
        return new ResponseEntity<>(foods, HttpStatus.OK);
    }
}
