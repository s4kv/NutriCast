package com.cs3300g1.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.models.UserSignUpRequest;
import com.cs3300g1.backend.repositories.UserRepository;

/**
 * This class handles all business logic related to the User's information.
 * User's information include its username, password, and email.
 */
@Service
public class UserService {
    private final UserRepository userRepository; // responsible for connecting the users collection in mongodb

    /**
     * This constructor takes in the userRepository.
     * @param userRepository responsible for connecting the users collection in mongodb.
     */
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * This method saves a User instance to mongoDB given the userEmail and userPassword.
     * @param userEmail the email the user used to sign up.
     * @param userPassword the password the user used to sign up.
     */
    public void saveUser(UserSignUpRequest user) {
        // 1. Create a user instance where the userName of the user is the same as the userEmail.
        //    The userName of the user can be changed by the user anytime.
        //    The calorieGoal is 0 at first.
        //    foodLogs should be null since there have been no logs yet.
        User newUser = new User(null, user.getEmail(), user.getPassword(), user.getEmail(), 0, null); 

        // 2. Save the user to mongoDb.
        userRepository.save(newUser);
    }
}
