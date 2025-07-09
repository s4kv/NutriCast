package com.cs3300g1.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document("chats")
@CompoundIndex(def = "{'participants': 1}", name = "participants_idx", unique = true)
public class Chat {

    @Id
    private String id;

    private List<String> participants;   // ordered list (sorted)
    private List<Message> messages = new ArrayList<>();

    public Chat() {}

    public Chat(List<String> sortedParticipants) {
        this.id = UUID.randomUUID().toString();
        this.participants = sortedParticipants;
    }

    public void addMessage(Message message) {
        messages.add(message);
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}
