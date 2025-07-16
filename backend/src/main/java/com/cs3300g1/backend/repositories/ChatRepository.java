package com.cs3300g1.backend.repositories;

import com.cs3300g1.backend.models.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
    Optional<Chat> findByParticipants(List<String> participants);
}
