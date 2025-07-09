package com.cs3300g1.backend.repositories;

import com.cs3300g1.backend.models.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * This interface represents a repository for users collection in MongoDB. This repository will be
 * used to perform CRUD (Create, Read, Update, Delete) operations on the users collection.
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
  /**
   * This method finds a user by their username in the database.
   *
   * @param username the username of the user to search for in the database.
   * @return an Optional containing the User if found, or an empty Optional if not found.
   */
  Optional<User> findByUsername(String username);

  /**
   * This method finds a user by their email in the database.
   *
   * @param email the email of the user to search for in the database.
   * @return an Optional containing the User if found, or an empty Optional if not found.
   */
  Optional<User> findByEmail(String email);

  Optional<User> findByAuthUid(String authUid);
}
