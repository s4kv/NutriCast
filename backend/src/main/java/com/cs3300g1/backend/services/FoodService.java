package com.cs3300g1.backend.services;

import com.cs3300g1.backend.models.Food;
import com.cs3300g1.backend.models.FoodRequest;
import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.repositories.FoodRepository;
import com.cs3300g1.backend.repositories.UserRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** This class handles all the business logic related to Food. */
@Service
public class FoodService {
  private final UserRepository
      userRepository; // responsible for connecting the users collection in mongoDb
  private final FoodRepository
      foodRepository; // responsible for connecting the foods collection in mongoDb

  /**
   * This constructor takes in all arguments.
   *
   * @param userRepository responsible for connecting the users collection in mongoDb.
   */
  @Autowired
  public FoodService(UserRepository userRepository, FoodRepository foodRepository) {
    this.userRepository = userRepository;
    this.foodRepository = foodRepository;
  }

  /**
   * This method will save the Food to mongoDb.
   *
   * @param userEmail the email of the user that added this food.
   * @param foodRequest the food request from the frontend.
   */
  public void saveFood(String userEmail, FoodRequest foodRequest) {
    // 1. Get the User object from userEmail.
    User user =
        userRepository
            .findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("No user found with the email: " + userEmail));

    // 2. Create a Food object and save it to mongoDB.
    Food food =
        new Food(
            null,
            user.getId(),
            foodRequest.getName(),
            foodRequest.getType(),
            foodRequest.getServingSize(),
            foodRequest.getServingUnit(),
            foodRequest.getFoodMacros());
    foodRepository.save(food);
  }

  /**
   * This method will get a list of foods with the matching userEmail and name.
   *
   * @param userEmail the email of the user that is searching for a food.
   * @param name the name of the food that the user is searching for.
   * @return a list of foods that matches the userEmail and name.
   */
  public List<Food> getFoodsWithUserEmailAndName(String userEmail, String name) {
    // 1. Get the User object from userEmail to get the userId.
    User user =
        userRepository
            .findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("No user found with the email: " + userEmail));

    // 2. Call findByUserIdAndName from FoodRepository.java to get a list of foods with the matching
    //    userId and name.
    //    If the name == '', then get all the Food objects that match the userId.
    //    If the name != '', then get all the Food objects that match the userId and name.
    List<Food> foods;
    if (name.equals("all")) {
      foods = foodRepository.findByUserId(user.getId());
    } else {
      foods = foodRepository.findByUserIdAndName(user.getId(), name);
    }
    return foods;
  }
}
