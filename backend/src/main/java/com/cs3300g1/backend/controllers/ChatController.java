package com.cs3300g1.backend.controllers;

import com.cs3300g1.backend.dto.MessageDTO;
import com.cs3300g1.backend.models.Chat;
import com.cs3300g1.backend.models.Message;
import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.repositories.UserRepository;
import com.cs3300g1.backend.services.ChatService;
import com.cs3300g1.backend.services.FirebaseAuthService;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends/chats")
public class ChatController {

    @Autowired private ChatService chatService;
    @Autowired private FirebaseAuthService firebaseAuthService;
    @Autowired private UserRepository userRepository;

    /* ---------------------------------------------------------------- */
    /*  POST /api/friends/chats                                          */
    /* ---------------------------------------------------------------- */
    @PostMapping
    public ResponseEntity<?> postMessage(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody MessageDTO dto) {

        try {
            /* ---- 1. verify token ---- */
            String token = authHeader.replace("Bearer ", "");
            FirebaseToken decoded = firebaseAuthService.verifyToken(token);

            /* ---- 2. resolve sender username via authUid ---- */
            String uid = decoded.getUid();
            User sender = userRepository.findByAuthUid(uid).orElse(null);

            if (sender == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User record not found for authUid=" + uid);
            }
            String senderUsername = sender.getUsername();

            /* ---- 3. sanity-check recipient ---- */
            if (dto.getRecipientUsername() == null || dto.getRecipientUsername().isBlank()) {
                return ResponseEntity.badRequest().body("recipientUsername is required");
            }

            /* ---- 4. delegate ---- */
            Chat updated = chatService.sendMessage(
                    senderUsername,
                    dto.getRecipientUsername(),
                    dto.getContent());

            return ResponseEntity.ok(updated);

        } catch (FirebaseAuthException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired auth token");
        }
    }

    /* ---------------------------------------------------------------- */
    /*  GET /api/friends/chats/{user1}/{user2}                           */
    /* ---------------------------------------------------------------- */
    @GetMapping("/{user1}/{user2}")
    public ResponseEntity<List<Message>> fetchConversation(
            @PathVariable("user1") String user1,
            @PathVariable("user2") String user2) {

        List<Message> messages = chatService.getConversation(user1, user2);
        return ResponseEntity.ok(messages);
    }

    /* ------------------------------------------------------------------ */
    /*  GET /api/friends/chats/with/{friendUsername}                       */
    /* ------------------------------------------------------------------ */
    @GetMapping("/with/{friendUsername}")
    public ResponseEntity<List<Message>> getConversationWith(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("friendUsername") String friendUsername) {

        try {
            String token = authHeader.replace("Bearer ", "");
            FirebaseToken decoded = firebaseAuthService.verifyToken(token);

            // who am I?
            User me = userRepository.findByAuthUid(decoded.getUid())
                                    .orElseThrow(() -> new RuntimeException("User not found"));
            String myUsername = me.getUsername();

            List<Message> messages = chatService.getConversation(myUsername, friendUsername);
            return ResponseEntity.ok(messages);

        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
