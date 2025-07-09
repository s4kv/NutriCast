package com.cs3300g1.backend.controllers;

import com.cs3300g1.backend.models.FriendRequest;
import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.services.FirebaseAuthService;
import com.cs3300g1.backend.services.FriendRequestService;
import com.cs3300g1.backend.services.UserService;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/friends")
public class FriendRequestController {

  private final FirebaseAuthService firebaseAuthService;
  private final FriendRequestService friendService;
  private final UserService userService;

  public FriendRequestController(
      FirebaseAuthService firebaseAuthService,
      FriendRequestService friendService,
      UserService userService) {
    this.firebaseAuthService = firebaseAuthService;
    this.friendService = friendService;
    this.userService = userService;
  }

  /* ------------------------------------------------------------------
  Send a friend request by username
  ------------------------------------------------------------------ */
  @PostMapping("/request")
  public ResponseEntity<?> sendRequest(
      @RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> body) {
    String token = authHeader.replace("Bearer ", "");
    FirebaseToken decoded;
    try {
      decoded = firebaseAuthService.verifyToken(token);
    } catch (FirebaseAuthException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid-token"));
    }

    String toUsername = body.get("username");
    if (toUsername == null || toUsername.isBlank()) {
      return ResponseEntity.badRequest().body(Map.of("error", "missing-username"));
    }

    User sender =
        userService
            .findByAuthUid(decoded.getUid())
            .orElseThrow(() -> new IllegalStateException("sender-not-found"));

    try {
      friendService.sendRequest(sender.getAuthUid(), toUsername.trim());
      return ResponseEntity.ok().build();
    } catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
    }
  }

  /* ------------------------------------------------------------------
  View incoming pending requests
  ------------------------------------------------------------------ */
  @GetMapping("/requests")
  public ResponseEntity<?> getIncomingRequests(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    FirebaseToken decoded;
    try {
      decoded = firebaseAuthService.verifyToken(token);
    } catch (FirebaseAuthException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid-token"));
    }

    User user =
        userService
            .findByAuthUid(decoded.getUid())
            .orElseThrow(() -> new IllegalStateException("user-not-found"));

    List<FriendRequest> requests = friendService.incomingRequests(user.getUsername());
    return ResponseEntity.ok(requests);
  }

  /* ------------------------------------------------------------------
  Accept or decline a request
  ------------------------------------------------------------------ */
  @PostMapping("/respond")
  public ResponseEntity<?> respond(
      @RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> body) {
    String token = authHeader.replace("Bearer ", "");
    FirebaseToken decoded;
    try {
      decoded = firebaseAuthService.verifyToken(token);
    } catch (FirebaseAuthException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid-token"));
    }

    User user =
        userService
            .findByAuthUid(decoded.getUid())
            .orElseThrow(() -> new IllegalStateException("user-not-found"));

    String requestId = body.get("requestId");
    boolean accept = Boolean.parseBoolean(body.get("accept"));

    try {
      friendService.respondToRequest(requestId, user.getUsername(), accept);
      return ResponseEntity.ok().build();
    } catch (IllegalStateException e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }

  /* ------------------------------------------------------------------
  List accepted friends
  ------------------------------------------------------------------ */
  @GetMapping
  public ResponseEntity<?> listFriends(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    FirebaseToken decoded;
    try {
      decoded = firebaseAuthService.verifyToken(token);
    } catch (FirebaseAuthException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid-token"));
    }

    return ResponseEntity.ok(friendService.listFriends(decoded.getUid()));
  }

  /* -----------------------------------------------------
  View outgoing (sent) pending requests
  ----------------------------------------------------- */
  @GetMapping("/requests/sent")
  public ResponseEntity<?> getSentRequests(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    FirebaseToken decoded;
    try {
      decoded = firebaseAuthService.verifyToken(token);
    } catch (FirebaseAuthException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid-token"));
    }

    return ResponseEntity.ok(friendService.outgoingRequests(decoded.getUid()));
  }
}
