package com.cs3300g1.backend.repositories;

import com.cs3300g1.backend.models.FriendRequest;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/** MongoDB repository for FriendRequest documents. */
@Repository
public interface FriendRequestRepository extends MongoRepository<FriendRequest, String> {

  // Incoming
  List<FriendRequest> findByToUsernameAndStatus(String toUsername, String status);

  // Outgoing (now by fromUsername)
  List<FriendRequest> findByFromUsernameAndStatus(String fromUsername, String status);

  // Duplicate-check
  Optional<FriendRequest> findByFromUsernameAndToUsernameAndStatus(
      String fromUsername, String toUsername, String status);
}
