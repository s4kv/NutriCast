const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // same folder

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Replace with the UID of the user you want to mark as a professional
const uid = "01MUBODLTDQdI65u4sONLiDFcBy1";  //setting davidizadi1605@gmail.com (david1) as a verified user

admin.auth().setCustomUserClaims(uid, { isPro: true })
  .then(() => {
    console.log(`Custom claim set for UID: ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error setting custom claim:", error);
    process.exit(1);
  });
