package com.cs3300g1.backend.services;

import com.cs3300g1.backend.models.Chat;
import com.cs3300g1.backend.models.Message;
import com.cs3300g1.backend.repositories.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    public Chat sendMessage(String sender,
                            String recipient,
                            String content) {

        // 1. Sort usernames for canonical participant key
        List<String> pair = new ArrayList<>(List.of(sender, recipient));
        Collections.sort(pair);

        // 2. Find or create chat
        Chat chat = chatRepository.findByParticipants(pair)
                                  .orElseGet(() -> new Chat(pair));

        // 3. Append and save
        chat.addMessage(new Message(sender, recipient, content));
        return chatRepository.save(chat);
    }

    public List<Message> getConversation(String user1, String user2) {
        List<String> pair = new ArrayList<>(List.of(user1, user2));
        Collections.sort(pair);

        return chatRepository.findByParticipants(pair)
                             .map(Chat::getMessages)
                             .orElse(Collections.emptyList());
    }
}
