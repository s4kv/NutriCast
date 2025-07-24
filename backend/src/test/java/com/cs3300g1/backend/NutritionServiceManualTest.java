
package com.cs3300g1.backend;

import com.cs3300g1.backend.exceptions.UserNotFoundException;
import com.cs3300g1.backend.repositories.UserRepository;
import com.cs3300g1.backend.services.NutritionService;

import org.junit.jupiter.api.Test;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class NutritionServiceManualTest {

    @Test
    public void testGetCalorieGoal_UserNotFound() {
        UserRepository userRepository = mock(UserRepository.class);
        NutritionService nutritionService = new NutritionService(userRepository, null, null);

        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            nutritionService.getUserCalorieGoal("nonexistent@example.com");
        });
    }
}
