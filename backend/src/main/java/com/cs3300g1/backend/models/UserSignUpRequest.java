package com.cs3300g1.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * This class represents a User's information for sign-up.
 * It includes the user's email and password.
 * 
 * TODO: Hash the user's password.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserSignUpRequest {
    private String email; // the email the user used to sign-up
    private String password; // the password the user used to sign-up
}
