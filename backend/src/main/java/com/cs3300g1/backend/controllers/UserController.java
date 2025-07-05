package com.cs3300g1.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cs3300g1.backend.models.UserSignUpRequest;
import com.cs3300g1.backend.services.UserService;

/**
 * This class represents a controller that handles all API endpoints for anything
 * related to the User's information such as username, password, and email.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    private UserService userService; // handles all the business logic related to the user's personal information

    /**
     * This constructor takes in userService.
     * @param userService handles all the business logic related to the user's personal information.
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * This method creates a new User instance and saves it to mongoDB.
     * @param userEmail the email the user signed up with.
     * @param userPassword the passwors the user signed up with.
     */
    @PostMapping
    public ResponseEntity<Void> user(@RequestBody UserSignUpRequest user) {
        userService.saveUser(user); // saves the user to mongoDB.
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
