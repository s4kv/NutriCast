package com.cs3300g1.backend.repositories;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.cs3300g1.backend.models.State; // Add this import

@Repository
public interface StateRepository extends MongoRepository<State, String> {
    Optional<State> findById(String id);

    Optional<State> findByName(String name);
}