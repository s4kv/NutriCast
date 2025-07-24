
package com.cs3300g1.backend;

import com.cs3300g1.backend.models.User;
import com.cs3300g1.backend.repositories.UserRepository;
import com.cs3300g1.backend.services.NutritionService;

import org.junit.jupiter.api.Test;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class NutritionServiceAiTest {

    @Test
    public void testGetCalorieGoal_DefaultUser() {
        UserRepository userRepository = mock(UserRepository.class);
        NutritionService nutritionService = new NutritionService(userRepository, null, null);
        User mockUser = mock(User.class);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(mockUser));
        when(mockUser.getCalorieGoal()).thenReturn(2000);

        int result = nutritionService.getUserCalorieGoal("user@example.com");
        assertEquals(2000, result);
    }
}
