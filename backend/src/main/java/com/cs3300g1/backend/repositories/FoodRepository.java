package com.cs3300g1.backend.repositories;

import com.cs3300g1.backend.models.Food;
import com.cs3300g1.backend.models.FoodType;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * This interface represents the repository for the collection foods in MongoDB. This repository
 * will be used to perform CRUD (Create, Read, Update, Delete) operations on the foods collection.
 */
@Repository
public interface FoodRepository extends MongoRepository<Food, String> {
  /**
   * Finds a list of Food items by the userId in mongoDB.
   * @param userId the unique identifier of the user.
   * @return a list of Food objects that matches the userId.
   */
  List<Food> findByUserId(String userId);

  /**
   * Finds a list of Food items by their name in the database.
   *
   * @param name the name of the food item to search for in the database.
   * @return a list of Food items that match the given name.
   */
  List<Food> findByName(String name);

  /**
   * Finds a list of Food items by their type in the database.
   *
   * @param type the type of food item to search for in the database (e.g., ITEM, MEAL).
   * @return a list of Food items that match the given type.
   */
  List<Food> findByType(FoodType type);

  /**
   * Finds a list of Food items by the userId that created the Food and
   * the name of the Food.
   * @param userId the unique identifier of the user that created the Food.
   * @param name the name of the Food.
   * @return a list of Food items that matches the given userId and name.
   */
  List<Food> findByUserIdAndName(String userId, String name);
}
