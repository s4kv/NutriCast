package com.cs3300g1.backend.models;

import lombok.Getter;
import lombok.Setter;

import org.springframework.data.mongodb.core.mapping.Field;

@Setter
@Getter
public class Properties {
    @Field("@id")
    private String atId;

    @Field("addr:city")
    private String city;

    @Field("addr:housenumber")
    private String houseNumber;

    @Field("addr:postcode")
    private String postcode;

    @Field("addr:state")
    private String state;

    @Field("addr:street")
    private String street;

    private String amenity;
    private String brand;

    @Field("brand:wikidata")
    private String brandWikidata;

    private String building;
    private String cuisine;
    private String name;
}
