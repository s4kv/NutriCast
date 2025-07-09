package com.cs3300g1.backend.models;

import java.time.Instant;
import java.util.UUID;

/**
 * Embedded message object in Chat – NOT a top-level Mongo document.
 */
public class Message {

    private String id;                 // unique per message
    private String senderUsername;
    private String recipientUsername;
    private Instant timestamp;
    private String content;

    /* ---------- constructors ---------- */

    public Message() {
        // required by Jackson / Mongo mapping
    }

    public Message(String senderUsername,
                   String recipientUsername,
                   String content) {
        this.id = UUID.randomUUID().toString();
        this.senderUsername = senderUsername;
        this.recipientUsername = recipientUsername;
        this.timestamp = Instant.now();
        this.content = content;
    }

    /* ---------- getters & setters ---------- */

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getRecipientUsername() {
        return recipientUsername;
    }

    public void setRecipientUsername(String recipientUsername) {
        this.recipientUsername = recipientUsername;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
