# NutriCast Release Notes - July 24, 2025

We're thrilled to announce the initial launch of NutriCast, packed with essential features designed to help you on your health and wellness journey!

## New Software Features ✨

This release introduces the following core functionalities:

### 1. Photo-Based Meal Logging & Nutrition Analysis

Effortlessly log your meals and get instant, detailed nutritional breakdowns. Simply snap a photo of your meal, and our AI will analyze it for calories, protein, carbs, and more. You can then modify, copy, or export this analysis.

### 2. Dynamic Nutrition Dashboard

Gain clear insights into your daily and weekly macronutrient intake. Our interactive dashboard visually summarizes your calories, carbs, and protein, updating in real-time as you log new meals.

### 3. AI-Powered Meal Suggestions

Get personalized meal ideas tailored to your ingredients or dietary needs. Upload a photo of your fridge contents or specify your preferences (e.g., calorie limits, macros, budget), and our AI will suggest delicious and nutritious meals with their full nutritional breakdowns.

### 4. Local Restaurant Discovery with Filters

Find healthy local dining options with ease. Our "Near Me" section uses your location to display nearby restaurants on a map. Apply filters for distance, price, and cuisine to discover places that fit your dietary goals. Tap on a restaurant pin for detailed information.

### 5. Social Connection & Progress Sharing

Connect with friends and share your fitness journey! Our "Profile" section allows you to send/accept friend requests, view friends' profiles, see their achievements, and compare progress streaks, fostering a supportive community.

### 6. Verified Professional Guidance Feed

Access valuable insights and advice from certified nutrition and fitness experts. Our "Community Feed" features posts from both users and verified professionals, providing a wealth of knowledge to support your goals. Create and share your own posts with text and images.

### 7. Barcode Scanner

Quickly log meals by scanning product barcodes. This new feature allows you to instantly retrieve nutritional information for packaged foods, streamlining your meal logging process.

---

## Bug Fixes

This release includes significant under-the-hood improvements and bug fixes to enhance your experience:

* **Improved Image Analysis Accuracy:** We've made multiple iterations and refined our prompt engineering pipeline for **GPT-4o**. This allows the AI to accurately extract and format nutritional data from diverse meal images into structured JSON, significantly reducing manual data entry for you.
* **Map Integration Switch:** We've successfully migrated from Mapbox to **Google Maps API**, resolving several integration bugs and providing a more stable and reliable map experience.
* **Enhanced Restaurant Discovery:** By leveraging the **Google Maps Nearby Places API** in conjunction with AI-powered filtering (using **GPT-4o** to analyze restaurant descriptions and user preferences), we now display highly relevant, personalized healthy dining options, moving beyond simple keyword searches.
* **Seamless Mobile UI/UX:** We've refactored our UI to replace web elements like `<div>` with native **React Native** components like `<View>`. We also implemented a comprehensive mobile-first UI/UX strategy, utilizing `KeyboardAvoidingView` and dynamic `ScrollView` adjustments. This ensures seamless keyboard interaction and a consistently intuitive native user experience across various devices and screen sizes.

---

## Known Bugs and Defects

* **Offline Functionality:** Some features may have limited functionality without an active internet connection. We are working on enhancing offline capabilities for future releases.
* **AI Nutrition Analysis Accuracy (Edge Cases):** While highly accurate, the AI's nutritional analysis for very complex or uncommon dishes may occasionally require minor manual adjustments. We are continuously training our AI to improve its accuracy across a wider range of meals.
* **Meal Suggestion Ingredient Specificity:** The AI-powered meal suggestions may sometimes recommend ingredients that are not exact matches to the user's uploaded fridge contents. Users may need to make slight substitutions. We are refining this feature for greater precision.
* **Limited Restaurant Menu Details:** While the app displays detailed restaurant information, specific menu item nutritional breakdowns are not yet available within the app. This functionality is planned for a future update.