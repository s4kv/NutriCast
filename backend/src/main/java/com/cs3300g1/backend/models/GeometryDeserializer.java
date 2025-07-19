
package com.cs3300g1.backend.models;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

public class GeometryDeserializer extends JsonDeserializer<Geometry> {

    @Override
    public Geometry deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode rootNode = p.getCodec().readTree(p);
        ObjectMapper mapper = (ObjectMapper) p.getCodec();

        Geometry geometry = new Geometry();

        // Logic for the 'type' field has been removed.

        JsonNode coordinatesArray = rootNode.get("coordinates");

        if (coordinatesArray != null && coordinatesArray.isArray() && coordinatesArray.size() > 0) {
            JsonNode firstPolygon = coordinatesArray.get(0);
            
            List<List<Double>> points = mapper.convertValue(
                firstPolygon, 
                new TypeReference<List<List<Double>>>() {}
            );
            geometry.setCoordinates(points);
        } else {
            geometry.setCoordinates(Collections.emptyList());
        }

        return geometry;
    }
}