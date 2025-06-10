package com.cs3300g1.backend.repositories;

import com.cs3300g1.backend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    @Query("{name:'?0'}")
    Optional<User> findByUsername(String username);

    @Query("{email:'?0'}")
    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
