package com.cs3300g1.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.util.ArrayList;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Document("restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class State {
  @Id @ToString.Exclude private String id; // Unique identifier for the state
  private String name; // the name of the state
  private ArrayList<Restaurant> features = new ArrayList<Restaurant>();

}