package com.cs3300g1.backend.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.cs3300g1.backend.models.Food;
import com.cs3300g1.backend.models.FoodType;
import com.cs3300g1.backend.models.Meal;

import java.util.List;

/**
 * This interface represents the repository for the collection foods in MongoDB.
 * This repository will be used to perform CRUD (Create, Read, Update, Delete) operations on the foods collection.
 */
@Repository
public interface FoodRepository extends MongoRepository<Food, String> {
    /**
     * Finds a list of Food items by their name in the database.
     * @param name the name of the food item to search for in the database.
     * @return a list of Food items that match the given name.
     */
    List<Food> findByName(String name);

    /**
     * Finds a list of Food items by their type in the database.
     * @param type the type of food item to search for in the database (e.g., ITEM, MEAL).
     * @return a list of Food items that match the given type.
     */
    List<Food> findByType(FoodType type);

    /**
     * Finds a list of Food items by their meal type in the database.
     * @param meal the type of meal to search for in the database (e.g., BREAKFAST, LUNCH, DINNER, SNACK).
     * @return a list of Food items that match the given meal type.
     */
    List<Food> findByMeal(Meal meal);
}
