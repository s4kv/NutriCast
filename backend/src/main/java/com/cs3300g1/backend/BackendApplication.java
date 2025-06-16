//testing commiting

package com.cs3300g1.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import com.cs3300g1.backend.repositories.UserRepository;

@SpringBootApplication
@EnableMongoRepositories
public class BackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(BackendApplication.class, args);
  }

  @Bean
  CommandLineRunner verify(UserRepository repo) {
    return args -> {
      if (repo.count() == 0) {
        System.out.println("No users found in the database.");
      } else {
        System.out.println("Users found in the database:");
        repo.findAll().forEach(user -> System.out.println(user.getUsername()));
      }
    };
  }

}
