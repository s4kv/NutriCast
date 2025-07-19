package com.cs3300g1.backend;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

import com.cs3300g1.backend.models.Properties;
import com.cs3300g1.backend.models.Restaurant;
import com.cs3300g1.backend.models.State;
import com.cs3300g1.backend.repositories.StateRepository;

/**
 * Integration test for the State model and StateRepository.
 * This test uses @DataMongoTest, which configures an in-memory MongoDB instance
 * and allows us to test the full persistence and query lifecycle.
 */
@DataMongoTest // Configures an in-memory MongoDB for testing
public class StateRepositoryIntegrationTest {

    @Autowired
    private StateRepository stateRepository;

    private State testState;
    private final String TEST_ID = "687aef884656abc80968f2d";

    @BeforeEach
    void setUp() {
        // Create a sample Properties object
        Properties properties = new Properties();
        properties.setName("Ono Hawaiian BBQ");
        properties.setCity("Tempe");
        properties.setState("AZ");
        properties.setStreet("S Rural Road");
        properties.setPostcode("85284");
        properties.setCuisine("barbecue;hawaiian");
        properties.setAtId("way/28737968");
        properties.setAmenity("restaurant");

        // Create a sample Restaurant object
        Restaurant restaurant = new Restaurant();
        restaurant.setId("some-restaurant-id");
        restaurant.setProperties(properties);

        // Create the top-level State object to be saved
        testState = new State();
        testState.setId(TEST_ID);
        testState.setFeatures(new ArrayList<>(Collections.singletonList(restaurant)));

        // Save the test data to the in-memory database
        stateRepository.save(testState);
    }

    @AfterEach
    void tearDown() {
        // Clean up the database after each test
        stateRepository.deleteAll();
    }

    /**
     * Tests if we can successfully save a State and then retrieve it
     * from the database using a repository query.
     */
    @Test
    void shouldFindStateById() {
        // --- Act ---
        // Query the database to find the state we just saved
        Optional<State> retrievedStateOptional = stateRepository.findById(TEST_ID);

        // --- Assert ---
        // 1. Check that the state was actually found
        assertThat(retrievedStateOptional).isPresent();
        State retrievedState = retrievedStateOptional.get();

        // 2. Verify the top-level fields
        assertThat(retrievedState.getId()).isEqualTo(TEST_ID);
        assertThat(retrievedState.getFeatures()).hasSize(1);

        // 3. Verify the nested properties to confirm mapping works
        Properties props = retrievedState.getFeatures().get(0).getProperties();
        assertThat(props.getName()).isEqualTo("Ono Hawaiian BBQ");
        assertThat(props.getCity()).isEqualTo("Tempe");
        assertThat(props.getAtId()).isEqualTo("way/28737968");
        assertThat(props.getAmenity()).isEqualTo("restaurant");
    }
}