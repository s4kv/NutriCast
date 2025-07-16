package com.cs3300g1.backend.dto;

/**
 * Payload sent by the client when posting a new message.
 * The server determines the sender based on the auth header.
 */
public class MessageDTO {

    private String recipientUsername;
    private String content;

    public MessageDTO() {}

    public MessageDTO(String recipientUsername, String content) {
        this.recipientUsername = recipientUsername;
        this.content = content;
    }

    /* ---------- getters / setters ---------- */

    public String getRecipientUsername() {
        return recipientUsername;
    }

    public void setRecipientUsername(String recipientUsername) {
        this.recipientUsername = recipientUsername;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
