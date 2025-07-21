package com.cs3300g1.backend.controllers;

import com.cs3300g1.backend.models.State;
import com.cs3300g1.backend.models.Restaurant;
import com.cs3300g1.backend.repositories.StateRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {
    @Autowired
    private StateRepository stateRepo;

    @GetMapping("/by-state")
    public List<Restaurant> getRestaurantsbyState(@RequestParam String state) {
        Optional<State> stateObj = stateRepo.findByName(state);
        if (stateObj.isPresent()) {
            return stateObj.get().getFeatures();
        } else {
            return Collections.emptyList();
        }
    }
}
