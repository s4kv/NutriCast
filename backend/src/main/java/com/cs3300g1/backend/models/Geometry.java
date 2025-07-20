package com.cs3300g1.backend.models;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@JsonDeserialize(using = GeometryDeserializer.class)
public class Geometry {
    // The 'type' field has been removed.
    private List<List<Double>> coordinates; 
}
