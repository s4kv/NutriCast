package com.cs3300g1.backend.models;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document("nutricast_picture_requests")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NutriCastPictureRequest {
  public String userMessage;
  // base64Image (which is called uri in frontend)
  public String base64Image;
}
