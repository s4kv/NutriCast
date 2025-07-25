# NutriCast: AI-Powered Nutrition & Wellness Platform 🍏✨

## 1. Description

NutriCast is a personalized, mobile-first food tracking and recommendation platform. It leverages cutting-edge AI for image recognition and nutrition analysis, combined with real-time location data, to help users seamlessly plan, track, and enjoy meals that perfectly match their dietary needs and preferences.

---

## 2. Key Features 🚀

* **Photo-Based Meal Logging:** Effortlessly track your intake! Detects calories, carbs, protein, and other macros directly from meal photos.
* **Nutrition Dashboard:** Visualize your progress with dynamic graphs showing daily and weekly intake of calories, carbohydrates, and protein.
* **Restaurant Recommendations:** Discover local, healthy dining options tailored to your dietary goals using the Google Maps API.
* **Smart Meal Suggestions:** Get personalized meal ideas generated from photos of your fridge contents or typed ingredients.
* **Recipe Generator:** Receive recipe suggestions complete with shopping lists, optimized based on your priorities (e.g., high protein, budget-friendly).
* **Surprise Me Feature:** Feeling adventurous? Get "I'm Feeling Lucky" meal suggestions that still adhere to your dietary constraints.
* **Verified Professionals:** Connect with and receive guidance from verified dietitians and fitness coaches who can share meal plans and workout routines.
* **Friends Network:** Share your journey! View friends' profiles, share meals, and celebrate each other's achievements and progress streaks.

---

## 3. Additional Features (Future Enhancements) 💡

* **Allergen Tracking & Warnings:** Receive alerts for potential allergens in meals and recipes.
* **Meal Tagging & Image Generation:** Organize your meals with custom tags and generate realistic meal images from recipe descriptions using a text-to-picture API.
* **Clear Data Disclaimers:** Transparent disclaimers regarding the accuracy of AI-generated nutritional data.

---

## 4. Tech Stack Specification 💻

NutriCast is built with a robust, modern technology stack to ensure performance, scalability, and an intuitive user experience.

### 4.1. Frontend Framework/Library

* **React Native:** For seamless cross-platform mobile development (iOS & Android).

### 4.2. Backend Framework

* **Java/Spring Boot:** Powering robust RESTful APIs and core application logic.

### 4.3. Database Technology

* **MongoDB:** A flexible NoSQL database for efficient storage of user data, food logs, and more.

### 4.4. Version Control System

* **Git / GitHub:** For collaborative development, version tracking, and code management.

### 4.5. Key Additional Tools & Libraries

* **Google Cloud Platform (GCP):** Cloud infrastructure for deployment and services.
* **OpenAI GPT-4:** For advanced AI capabilities like image-based nutrition analysis and smart suggestions.
* **Google Maps API:** For location-based features and restaurant discovery.
* **Google Gemini:** Utilized for AI-driven testing and development acceleration.
* **Firebase:** For authentication and media storage.

---

## 5. Minimal Marketable Features (MMFs) ✨

These core features represent the essential functionalities for NutriCast's initial launch, ensuring immediate value to our users.

### 5.1. Photo-Based Meal Logging & Nutrition Analysis

**Goal:** Allow users to effortlessly log meals and receive instant nutritional breakdowns via AI.

**User Flow:**
1.  User logs into the application.
2.  User navigates to the "Log Meals" section.
3.  User uploads a photo of their meal.
4.  AI (GPT-4) processes the photo and generates a detailed nutritional analysis (calories, protein, carbs, etc.).
5.  The nutritional breakdown is displayed prominently on the frontend.
6.  User has options to modify, copy, or export the analysis.

### 5.2. Dynamic Nutrition Dashboard

**Goal:** Provide users with a clear visual summary of their daily and weekly macronutrient intake.

**User Flow:**
1.  User logs into the application.
2.  User navigates to the "Dashboard" section.
3.  Past meal information and dietary goals, stored in MongoDB, are fetched and displayed.
4.  Daily and weekly intake of calories, carbs, and protein are dynamically summed and presented graphically (via React Native frontend).
5.  Users can input new meals, and the dashboard updates in real-time.

### 5.3. AI-Powered Meal Suggestions

**Goal:** Offer personalized meal ideas based on available ingredients or dietary constraints.

**User Flow:**
1.  User logs into the application.
2.  User navigates to the "AI Meal Suggestion" section.
3.  User uploads a photo of fridge contents or types in ingredients/constraints (e.g., calorie limits, macros, budget).
4.  GPT-4 processes the input and generates a personalized meal suggestion.
5.  The suggested meal, along with its nutritional breakdown, appears on the React Native frontend.
6.  User can modify, copy, or export the suggestion.

### 5.4. Local Restaurant Discovery with Filters

**Goal:** Help users find healthy local dining options tailored to their preferences.

**User Flow:**
1.  User logs into the application.
2.  User navigates to the "Near Me" section.
3.  The app requests and uses the user's location via Google Maps API to display a map with their current pin.
4.  User can apply filters (distance, price, cuisine) via the React Native interface, hiding restaurants that don't meet the criteria.
5.  Users can tap on a restaurant pin to view detailed information.

### 5.5. Social Connection & Progress Sharing

**Goal:** Enable users to connect with friends and share their fitness journeys.

**User Flow:**
1.  User logs into the application.
2.  User navigates to their "Profile" section.
3.  User accesses the "Friends" section.
4.  Users can send/accept friend requests, view friends' profiles, see their achievements, and compare progress streaks.

### 5.6. Verified Professional Guidance Feed

**Goal:** Provide users with access to insights and advice from certified nutrition and fitness experts.

**User Flow:**
1.  User logs into the application.
2.  User navigates to the "Community Feed" (or similar social media section).
3.  Users can scroll through a feed of posts from other users and verified professionals.
4.  Verified professionals (or any user) can create posts containing text, images, or both, which are stored in MongoDB and instantly visible in the feed to other users.

---

## 6. Installation 🛠️

Ready to get NutriCast up and running? Our comprehensive installation guide will walk you through everything needed to set up the application, from prerequisites to execution.

**Highlights:**
* **Prerequisites:** All necessary software and hardware configurations.
* **Dependencies:** Required third-party libraries.
* **Build & Run:** Step-by-step instructions for compiling and launching the application.
* **Troubleshooting:** Solutions for common setup issues.

➡️ **For detailed installation instructions, please refer to our [INSTALL_GUIDE.md](INSTALL_GUIDE.md).**

---

## 7. Release Information 📜

Stay updated with the latest features, improvements, and known issues in NutriCast.

**Current Release Highlights (v1.0.0):**
* **New Features:** Fully functional Photo-Based Meal Logging with AI analysis, Dynamic Nutrition Dashboard, AI-Powered Meal Suggestions, and seamless Restaurant Discovery.
* **Bug Fixes:** Enhanced stability for image uploads, improved friend system synchronization, and minor UI refinements.
* **Known Issues:** (Example: Occasional delay in initial AI meal suggestion loading on slower networks.)

➡️ **For a comprehensive list of new features, bug fixes, and known issues, please see our [RELEASE_NOTES.md](RELEASE_NOTES.md).**

---

## Before you can run the project, do the following things:
1. Make a new branch from main.
2. Clone the repository to any IDE.
3. Make sure to switch to the branch you just created.
   ```
   git checkout {new_branch_name}
   ```
4. Install node_modules in the frontend folder.
   ```
   cd "frontend"
   npm install
   ```
5. Add the 'firebase-service-account.json' file under the resources folder in the backend.
6. If you did steps 1 to 5, you can test the project locally from the terminal. But remember to change the BASE_URL constant in the backend.ts file to your local host server.
7. (Optional) If you want to test the project on the phone, you have to do a couple more things:  
8. Make sure you have a .mvn folder, mvnw file, mvnw.cmd file, and app.yaml file in the backend folder. To install the .mvn folder, type the following code into the terminal:  
   ```
   cd "backend"
   mvn wrapper:wrapper
   ```  
9. Make sure that the BASE_URL constant in the backend.ts file is a https server (in our case, a server hosted by Google Cloud Platform (GCP)).  
10. Make sure you have the expo application installed on your phone.  
11. If you want to make changes to the backend and see your changes in the Google Cloud Platform server, you will have to the following steps:  
12. Make sure you are in the nutricast GCP.  
13. If this is your first time deploying the backend folder to the nutricast GCP, do the following code:

For Linux or macOS:  
```  
cd "backend"
./mvnw clean install -DskipTests  
gcloud init  
gcloud app deploy  
gcloud app browse  
```  
For Windows:  
```  
cd "backend"
.\mvnw.cmd clean install -DskipTests
gcloud init
gcloud app deploy
gcloud app browse
```  
14. If this is not your first time deploying the backend folder to the nutricast GCP, do the following code:  

For Linux or macOS:  
```  
cd "backend"  
./mvnw clean install -DskipTests  
gcloud app deploy  
gcloud app browse  
```
For Windows:
```  
cd "backend"  
.\mvnw.cmd clean install -DskipTests
gcloud app deploy  
gcloud app browse  
```         
15. Get the url from 'gcloud app deploy' or 'gcloud app browse' and put it in the backend.ts file in the frontend folder. Now you can start running the project from the phone.  


## Run from the phone (https server)
1. Run expo (frontend).
   ```
   cd "frontend"
   npx expo start
   ```
2. Use the phone to scan the barcode, which will open the development application on the expo app you installed on your phone.
3. If you are making changes to the backend, don't forget that you have to compile the backend and add it to Google Cloud Platform.
   For Linux or macOS:  
   ```
   cd "backend"
   ./mvnw clean install -DskipTests
   gcloud app deploy
   ```

   For Windows:  
   ```
   cd "backend"
   .\mvnw.cmd clean install -DskipTests 
   gcloud app deploy
   ```
4. Re-run expo (frontend) to see the changes made in the backend.
   ```
   cd "frontend"
   npx expo start
   ```
5. (Optional) If you want to know if the backend controllers you just made are working, you should launch the gcloud server and test it before so that you know the backend is working and if it is not working in the frontend, it will be easier to debug the problem.
   ```
   cd "backend"
   gcloud app browse
   ```

## Run from terminal (locally)
1. Run BackendApplication.java from backend folder.
2. Run expo (frontend).
   ```
   cd "frontend"
   npx expo start
   ```
3. Open local web link from output.

## Run with docker

1. Make sure to have docker installed on your machine.
2. Clone the repository:

   ```bash
   git clone https://github.com/s4kv/NutriCast.git
   ```

3. Create a `.env` file in the root directory of the project with the following content:

   ```env
   OPENAI_API_KEY=your_gemini_api_key
   MAPBOX_API_KEY=your_mapbox_api_key
   ```
   This last key can be obtained from the mapbox console: https://console.mapbox.com/account/access-tokens/

5. Run docker compose:

   ```bash
   docker compose up --build
   ```