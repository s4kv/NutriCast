package com.cs3300g1.backend.controllers;

import com.cs3300g1.backend.models.ProPost;
import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.repositories.ProPostRepository;
import com.cs3300g1.backend.repositories.UserRepository;
import com.cs3300g1.backend.services.FirebaseAuthService;
import com.google.firebase.auth.FirebaseAuthException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/pro-posts")
public class ProPostController {

    @Autowired
    private ProPostRepository proPostRepository;

    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody ProPost post, @RequestHeader("Authorization") String authHeader) {
        try {
            var decodedToken = firebaseAuthService.verifyToken(authHeader.replace("Bearer ", ""));
            String uid = decodedToken.getUid();

            // Lookup the user by Firebase UID
            java.util.Optional<User> optionalUser = userRepository.findByAuthUid(uid);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }
            User dbUser = optionalUser.get();
            if (dbUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            if (!Boolean.TRUE.equals(decodedToken.getClaims().get("isPro"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only verified professionals can post.");
            }

            post.setAuthorId(uid);
            post.setAuthorUsername(dbUser.getUsername()); // use actual username from DB
            post.setCreatedAt(new Date());

            return ResponseEntity.ok(proPostRepository.save(post));
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }
    }

    @GetMapping
    public List<ProPost> getAllPosts() {
        return proPostRepository.findAllByOrderByCreatedAtDesc();
    }
}
