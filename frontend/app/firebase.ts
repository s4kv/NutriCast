import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// maybe import the db in the future? but we will not use it for now
// right now we are using mongodb

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBGAZArAPklh9_y0C92SE0v1_fFzVf4Z8s",
  authDomain: "nutricast-backend.firebaseapp.com",
  projectId: "nutricast-backend",
  storageBucket: "nutricast-backend.firebasestorage.app",
  messagingSenderId: "694486797890",
  appId: "1:694486797890:web:6231ac98a3116c9ee867db",
  measurementId: "G-0LQLHPW33T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage(app);

// export { app, analytics, storage };
export { app, storage };
