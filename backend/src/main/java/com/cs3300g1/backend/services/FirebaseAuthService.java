package com.cs3300g1.backend.services;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import java.io.IOException;
import javax.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class FirebaseAuthService {

  /** Initialize {@link FirebaseApp} exactly once. */
  @PostConstruct
  public void init() throws IOException {
    if (FirebaseApp.getApps().isEmpty()) {
      // Option 1: load from resources
      var resource = new ClassPathResource("firebase-service-account.json");
      GoogleCredentials creds = GoogleCredentials.fromStream(resource.getInputStream());

      FirebaseOptions options = FirebaseOptions.builder().setCredentials(creds).build();
      FirebaseApp.initializeApp(options);
    }
  }

  /** Create a Firebase user (e‑mail + password). */
  public UserRecord createFirebaseUser(String email, String password) throws FirebaseAuthException {
    UserRecord.CreateRequest req =
        new UserRecord.CreateRequest().setEmail(email).setPassword(password);
    return FirebaseAuth.getInstance().createUser(req);
  }

  /** Verify ID token sent from client; throws if invalid/expired. */
  public FirebaseToken verifyToken(String idToken) throws FirebaseAuthException {
    return FirebaseAuth.getInstance().verifyIdToken(idToken);
  }

  public UserRecord getUserByEmail(String email) throws FirebaseAuthException {
    return FirebaseAuth.getInstance().getUserByEmail(email);
  }
}
