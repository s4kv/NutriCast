package com.cs3300g1.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * This class represents a user in NutriCast.
 * The user will include fields such as id, username, password, email, and list of food that the user has logged.
 * 
 * TODO:
 * - Hash the user's password before passing it through to the database.
 */
@Document("users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {
    @Id
    @ToString.Exclude private String id; // Unique identifier for the user
    private String username; // Username of the user
    private String password; // Password of the user
    private String email; // Email of the user
    private List<FoodLog> foodLogs; // List of foods that the user has logged
}
