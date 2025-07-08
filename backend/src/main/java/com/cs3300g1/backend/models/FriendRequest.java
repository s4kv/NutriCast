package com.cs3300g1.backend.models;

import java.time.Instant;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("friend_requests")
@Getter
@Setter
@NoArgsConstructor //  ← REQUIRED so Spring can create the object
public class FriendRequest {

  @Id private String id;

  private String fromUsername;
  private String toUsername;
  private String status = "PENDING";
  private Instant sentAt = Instant.now();

  /** convenience ctor used when you create a new request */
  public FriendRequest(String fromUsername, String toUsername) {
    this.fromUsername = fromUsername;
    this.toUsername = toUsername;
  }
}
