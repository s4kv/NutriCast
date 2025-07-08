package com.cs3300g1.backend.models;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * This class represents a user in NutriCast. The user will include fields such as id, username,
 * password, email, and list of food that the user has logged.
 *
 * <p>TODO: Hash the user's password before passing it through to the database.
 */
@Document("users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {
  @Id @ToString.Exclude private String id; // Unique identifier for the user

  @Indexed(unique = true, sparse = true)
  private String username; // Username of the user

  @Indexed(unique = true)
  private String authUid; // <-- Add this field

  @Indexed(unique = true)
  private String email; // Email of the user

  private int calorieGoal; // Number of calories the user wants to consume each day

  private List<FoodLog> foodLogs; // List of foods that the user has logged

  private List<String> friends;
}
