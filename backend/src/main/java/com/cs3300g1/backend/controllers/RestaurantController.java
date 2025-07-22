package com.cs3300g1.backend.controllers;

import com.cs3300g1.backend.models.State;
import com.cs3300g1.backend.controllers.RestaurantController.RestaurantDTO;
import com.cs3300g1.backend.models.Restaurant;
import com.cs3300g1.backend.repositories.StateRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

@PostMapping("/nearby")
public List<RestaurantDTO> getNearbyRestaurants(@RequestBody LocationRequest req) {
    String apiKey = System.getenv("GOOGLE_MAPS_API_KEY");
    String url = String.format(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%f,%f&radius=%d&type=restaurant&key=%s",
        req.getLatitude(), req.getLongitude(), req.getRadius(), apiKey
    );
    RestTemplate restTemplate = new RestTemplate();
    Map response = restTemplate.getForObject(url, Map.class);
    List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");

    List<String> typesFilter = req.getTypes(); // <-- changed from getCuisines()
    List<RestaurantDTO> restaurants = results.stream()
        .map(result -> {
            Map<String, Object> location = (Map<String, Object>) ((Map<String, Object>) result.get("geometry")).get("location");
            String name = (String) result.get("name");
            List<String> types = (List<String>) result.get("types");
            return new RestaurantDTO(
                name,
                (Double) location.get("lat"),
                (Double) location.get("lng"),
                types
            );
        })
        .filter(r -> typesFilter == null || typesFilter.isEmpty() || r.getTypes().stream().anyMatch(typesFilter::contains))
        .collect(Collectors.toList());

    return restaurants;
}
  
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LocationRequest {
        private double latitude;
        private double longitude;
        private int radius;
        private List<String> types;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RestaurantDTO {
        private String name;
        private double latitude;
        private double longitude;
        private List<String> types;
    }
}
