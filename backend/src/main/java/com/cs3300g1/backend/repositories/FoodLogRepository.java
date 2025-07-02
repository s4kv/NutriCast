package com.cs3300g1.backend.repositories;

import java.time.Instant;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.cs3300g1.backend.models.FoodLog;
import com.cs3300g1.backend.models.Meal;

/**
 * This interface represents the repository for the collection of foods_log in MongoDB.
 * This repository will be used to perform CRUD operations (Create, Read, Update, Delete) operations on the foods collection.
 */
@Repository
public interface FoodLogRepository extends MongoRepository<FoodLog, String> {
    /**
     * Finds a list of foods logged by a user id in the database.
     * @param id user id.
     * @return a list of foods logged that match the given user id.
     */
    List<FoodLog> findByUserId(String userId);

    /**
     * Finds a list of foods logged that matches a food id in the database.
     * @param foodId food id in the database.
     * @return a list of foods logged that match the given food id.
     */
    List<FoodLog> findByFoodId(String foodId);

    /**
     * Finds a list of foods logged that matches the type of meal in the database.
     * @param meal type of meal (BREAKFAST, LUNCH, DINNER, SNACK)
     * @return a list of foods logged that match the given food id.
     */
    List<FoodLog> findByMeal(Meal meal);

    /**
     * Finds a list of foods logged that matches the user id and is in between two timestamps in the database.
     * For example, this will be used to find the number of calories consumed by a user in a certain day.
     * @param userId user id.
     * @param start the timestamp to start the search from (inclusive).
     * @param end the timestamp to end to search (exclusive).
     * @return a list of foods logged that matches the user id and is in between two timestamps.
     */
    @Query("{ 'userId': ?0, 'timestamp': { $gte: ?1, $lt: ?2 } }")
    List<FoodLog> findUserFoodLogsForToday(String userId, Instant start, Instant end);
}
