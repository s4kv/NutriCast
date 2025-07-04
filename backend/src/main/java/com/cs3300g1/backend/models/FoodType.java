package com.cs3300g1.backend.models;

/**
 * This enum represents the type of food in NutriCast.
 * There are three types of food:
 * 1. ITEM - A single food item (e.g., chicken breast, apple, water)
 * 2. MEAL - A combination of food items (e.g., chicken breast with rice and broccoli, protein shake with water and protein powder)
 */
public enum FoodType {
    ITEM, // A single food item
    MEAL // A combination of single food items
}
