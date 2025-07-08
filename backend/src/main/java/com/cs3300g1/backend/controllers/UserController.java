package com.cs3300g1.backend.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.models.UserSignUpRequest;
import com.cs3300g1.backend.services.UserService;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.cs3300g1.backend.services.FirebaseAuthService;

/**
 * This class represents a controller that handles all API endpoints for anything
 * related to the User's information such as username, password, and email.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final FirebaseAuthService firebaseAuthService;
    private final UserService userService;


    @Autowired
    public UserController(FirebaseAuthService firebaseAuthService, UserService userService) {
        this.firebaseAuthService = firebaseAuthService;
        this.userService = userService;
    }

    @PostMapping("/register-email")
    public ResponseEntity<?> registerEmail(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String rawPassword = body.get("password");
        if (email == null || rawPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email+password required"));
        }
    UserRecord record;
    try {
        // ✨ 1. Try to fetch the user first
        record = firebaseAuthService.getUserByEmail(email);
    } catch (FirebaseAuthException notFound) {
        // ✨ 2. Only create if it DOESN'T exist
        try {
            record = firebaseAuthService.createFirebaseUser(email, rawPassword);
        } catch (FirebaseAuthException createFail) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(Map.of("error", createFail.getMessage()));
        }
    }

    // 3. Create shell user in Mongo (safe even if it already exists—make it idempotent)
    User saved = userService.createOrGetUserShell(email, record.getUid());

    return ResponseEntity.status(HttpStatus.CREATED)
                         .body(Map.of("userId", saved.getId()));
}

    @PostMapping("/username")
    public ResponseEntity<?> setUsername(@RequestHeader("Authorization") String authHeader,
                                        @RequestBody Map<String, String> body) {

        String token = authHeader.replace("Bearer ", "");
        FirebaseToken decoded;
        try {
            decoded = firebaseAuthService.verifyToken(token);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("error", "invalid-token"));
        }

        String username = body.get("username");
        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "username required"));
        }

        try {
            userService.setUsernameByEmail(decoded.getEmail(), username);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException dup) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(Map.of("error", dup.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        FirebaseToken decoded;
        try {
            decoded = firebaseAuthService.verifyToken(token);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("error", "invalid-token"));
        }
        return userService.findById(decoded.getUid())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
