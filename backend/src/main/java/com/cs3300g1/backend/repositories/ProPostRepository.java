package com.cs3300g1.backend.repositories;

import com.cs3300g1.backend.models.ProPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProPostRepository extends MongoRepository<ProPost, String> {
    List<ProPost> findAllByOrderByCreatedAtDesc();
}
