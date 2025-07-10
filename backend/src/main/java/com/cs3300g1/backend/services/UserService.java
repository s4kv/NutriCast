package com.cs3300g1.backend.services;

import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.repositories.UserRepository;
import java.util.ArrayList;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * This class handles all business logic related to the User's information. User's information
 * include its username, password, and email.
 */
@Service
public class UserService {
  private final UserRepository
      userRepository; // responsible for connecting the users collection in mongodb

  /**
   * This constructor takes in the userRepository.
   *
   * @param userRepository responsible for connecting the users collection in mongodb.
   */
  @Autowired
  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Creates a provisional user document containing only email + auth identifier. The <code>username
   * </code> field is purposely left <code>null</code> so the client can prompt for it later.
   *
   * @param email unique e‑mail address (verified by Firebase or similar)
   * @param uid Firebase UID or a password hash – whatever your auth layer uses
   * @return the saved {@link User} with its generated Mongo ID
   * @throws IllegalStateException if the e‑mail already exists
   */
  public User createOrGetUserShell(String email, String uid) {
    return userRepository
        .findByEmail(email)
        .orElseGet(
            () ->
                userRepository.save(new User(null, null, uid, email, 0, new ArrayList<>(), new ArrayList<>())));
  }

  /**
   * Sets or updates the public username, ensuring uniqueness.
   *
   * @param userId MongoDB _id (we trust this came from the auth token)
   * @param username desired handle, case‑sensitive and URL‑safe in UI
   * @throws IllegalStateException if username is taken or userId not found
   */
  public void setUsername(String userId, String username) {
    userRepository
        .findByUsername(username)
        .ifPresent(
            existing -> {
              if (!existing.getId().equals(userId)) {
                throw new IllegalStateException("username-exists");
              }
            });

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new IllegalStateException("user-not-found"));

    user.setUsername(username);
    userRepository.save(user);
  }

  /** Legacy single‑step path – kept for compatibility; consider removing. */
  public User saveUser(User user) {
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
      throw new IllegalStateException("email-exists");
    }
    if (user.getUsername() != null
        && userRepository.findByUsername(user.getUsername()).isPresent()) {
      throw new IllegalStateException("username-exists");
    }
    return userRepository.save(user);
  }

  /** Fetch by ID. */
  public Optional<User> findById(String id) {
    return userRepository.findById(id);
  }

  /** Fetch by e‑mail. */
  public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  /** Fetch by username. */
  public Optional<User> findByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  public void setUsernameByEmail(String email, String username) {

    if (userRepository.findByUsername(username).isPresent()) {
      throw new IllegalStateException("username-exists");
    }

    User u =
        userRepository
            .findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("user-not-found"));

    u.setUsername(username);
    userRepository.save(u);
  }

  public String getUsername(String userId) {
    return userRepository
        .findById(userId)
        .map(User::getUsername)
        .orElseThrow(() -> new IllegalStateException("user-not-found"));
  }


  public String getEmailByUsername(String username) {
      return userRepository
              .findByUsername(username)
              .map(User::getEmail)
              .orElseThrow(() -> new IllegalArgumentException("user-not-found"));
  }


  public Optional<User> findByAuthUid(String authUid) {
    return userRepository.findByAuthUid(authUid);
  }
}
