// src/main/java/com/cs3300g1/backend/controllers/BarcodeController.java
package com.cs3300g1.backend.controllers;

import com.cs3300g1.backend.models.BarcodeRequest;
import com.cs3300g1.backend.models.Food; // Assuming you'll return a Food object
import com.cs3300g1.backend.models.ScannedFoodItem;
import com.cs3300g1.backend.services.OpenAIBarcodeService; // New service
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/barcode")
public class BarcodeController {

    private final OpenAIBarcodeService openAIBarcodeService;

    public BarcodeController(OpenAIBarcodeService openAIBarcodeService) {
        this.openAIBarcodeService = openAIBarcodeService;
    }

    @PostMapping("/scan")
    public ResponseEntity<ScannedFoodItem> handleBarcodeScan(@RequestBody BarcodeRequest barcodeRequest) {
        String barcode = barcodeRequest.getBarcode();
        if (barcode == null || barcode.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            ScannedFoodItem scannedItem = openAIBarcodeService.getScannedFoodItemFromBarcode(barcode);
            if (scannedItem != null) {
                return ResponseEntity.ok(scannedItem);
            } else {
                return ResponseEntity.notFound().build(); // OpenAI couldn't interpret or find data
            }
        } catch (Exception e) {
            // Log the exception (e.g., OpenAI API error, parsing error)
            System.err.println("Error processing barcode with OpenAI: " + e.getMessage());
            return ResponseEntity.internalServerError().build(); // Generic error
        }
    }
}