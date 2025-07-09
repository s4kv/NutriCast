package com.cs3300g1.backend.services;

import com.cs3300g1.backend.models.FriendRequest;
import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.repositories.FriendRequestRepository;
import com.cs3300g1.backend.repositories.UserRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FriendRequestService {

  private final FriendRequestRepository friendRepo;
  private final UserRepository userRepo;

  public FriendRequestService(FriendRequestRepository friendRepo, UserRepository userRepo) {
    this.friendRepo = friendRepo;
    this.userRepo = userRepo;
  }

  /* ------------------------------------------------------------------
  Send a friend request by target username
  ------------------------------------------------------------------ */
  public void sendRequest(String fromAuthUid, String toUsername) {

    // 1. Look-up recipient by username
    User toUser =
        userRepo
            .findByUsername(toUsername)
            .orElseThrow(() -> new IllegalStateException("user-not-found"));

    // 2. Look-up sender by Firebase UID
    User fromUser =
        userRepo
            .findByAuthUid(fromAuthUid)
            .orElseThrow(() -> new IllegalStateException("sender-not-found"));

    String fromUsername = fromUser.getUsername(); // ⭐ we now store the sender’s username

    if (fromUser.getId().equals(toUser.getId())) {
      throw new IllegalStateException("cannot-add-yourself");
    }

    // 3. Already friends?
    if (fromUser.getFriends() != null && fromUser.getFriends().contains(toUser.getId())) {
      throw new IllegalStateException("already-friends");
    }

    // 4. Pending duplicate?
    boolean pendingExists =
        friendRepo
            .findByFromUsernameAndToUsernameAndStatus(fromUsername, toUsername, "PENDING")
            .isPresent();

    if (pendingExists) {
      throw new IllegalStateException("request-already-sent");
    }

    // 5. Save new request (username → username)
    friendRepo.save(new FriendRequest(fromUsername, toUsername));
  }

  /* ------------------------------------------------------------------
  Fetch incoming pending requests for the current user
  ------------------------------------------------------------------ */
  public List<FriendRequest> incomingRequests(String currentUsername) {
    return friendRepo.findByToUsernameAndStatus(currentUsername, "PENDING");
  }

  /* ------------------------------------------------------------------
  Fetch outgoing pending requests for the current user
  ------------------------------------------------------------------ */
  public List<FriendRequest> outgoingRequests(String fromAuthUid) {
    String fromUsername =
        userRepo
            .findByAuthUid(fromAuthUid)
            .orElseThrow(() -> new IllegalStateException("user-not-found"))
            .getUsername();
    return friendRepo.findByFromUsernameAndStatus(fromUsername, "PENDING");
  }

  /* ------------------------------------------------------------------
  Accept or decline a request
  ------------------------------------------------------------------ */
  @Transactional
  public void respondToRequest(String requestId, String currentUsername, boolean accept) {

    FriendRequest req =
        friendRepo
            .findById(requestId)
            .orElseThrow(() -> new IllegalStateException("request-not-found"));

    if (!req.getToUsername().equals(currentUsername)) {
      throw new IllegalStateException("not-your-request");
    }
    if (!req.getStatus().equals("PENDING")) {
      throw new IllegalStateException("already-resolved");
    }

    if (accept) {
      req.setStatus("ACCEPTED");
      friendRepo.save(req);

      // Sender is now located by USERNAME, not UID
      User from =
          userRepo
              .findByUsername(req.getFromUsername())
              .orElseThrow(() -> new IllegalStateException("sender-not-found"));
      User to =
          userRepo
              .findByUsername(currentUsername)
              .orElseThrow(() -> new IllegalStateException("recipient-not-found"));

      // Guard against null friends list
      if (from.getFriends() == null) from.setFriends(new ArrayList<>());
      if (to.getFriends() == null) to.setFriends(new ArrayList<>());

      from.getFriends().add(to.getId());
      to.getFriends().add(from.getId());

      userRepo.save(from);
      userRepo.save(to);
    } else {
      req.setStatus("DECLINED");
      friendRepo.save(req);
    }
  }

  /* ------------------------------------------------------------------
  Utility: get friends list for a Firebase UID
  ------------------------------------------------------------------ */
  public List<User> listFriends(String authUid) {
    User u =
        userRepo
            .findByAuthUid(authUid)
            .orElseThrow(() -> new IllegalStateException("user-not-found"));

    List<String> ids = u.getFriends();
    if (ids == null || ids.isEmpty()) {
      return List.of(); // <- avoid passing null to repository
    }
    return userRepo.findAllById(ids);
  }
}
