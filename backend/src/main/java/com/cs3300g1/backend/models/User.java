package com.cs3300g1.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * This class represents a user in NutriCast.
 * The user will include fields such as id, username, password, email, and list of food that the user has logged.
 * 
 * NOTE:
 * - We have implemented user authentication using firebase, but to track the number of calories consumed by the user,
 *   we will need an attribute of an list of food that the user has logged. I am sure there is a way to create a custom user model in firebase,
 *   but for now, I just want to test the functionality when the user logs a food and that it updates the dashboard.
 * - For now, I will be storing the password as plain text, but in the future, if we are going to implement this user model in mongoDB,
 *   we should hash the password before storing it.
 */
@Document("users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id; // Unique identifier for the user
    private String username; // Username of the user
    private String password; // Password of the user
    private String email; // Email of the user
    private List<String> loggedFoodIds; // List of foods that the user has logged
}
