# NutriCast

## 1. Description
- A personalized food tracking and recommendation platform that uses image recognition, nutrition analysis, and real-time location data to help users plan, track, and enjoy meals that match their dietary needs and preferences.

2. Key Features
- Photo-Based Meal Logging: Detects calories, carbs, protein, etc., from meal photos.
- Nutrition Dashboard: Graph daily/weekly intake of calories, carbs, and protein.
- Restaurant Recommendations: Use Google Maps API to find local meals based on dietary goals.
- Smart Meal Suggestions: Suggest meals from fridge photos or typed ingredients.
- Recipe Generator: Suggest recipes + shopping list based on user priorities (e.g., protein, budget).
- Surprise Me Feature: “I’m Feeling Lucky” meal suggestions within user constraints.
- Verified Professionals: verified dietitians and fitness coaches that can share meals and their workout plan.
- Friends: View friends profiles, share meals with friends, etc.

3. Additional Features
- Allergen tracking and warnings.
- Meal tagging and image generation from recipes.
- Clear disclaimers on data accuracy.
- Generate realistic meal images from recipe descriptions using a text-to-picture API.

4. Tech Stack Specification

4.1. Frontend framework/library
- React Native

4.2. Backend framework
- Java/SpringBoot

4.3. Database technology
- mongoDB

4.4 Version Control System
- Github/Git

4.5. Any Additional tools or libraries
- Google Cloud Platform (GCP), GPT-4, Google Maps API, Gemini

5. Minimal Marketable Features

5.1. Users can log meals by uploading photos from React Native, process it using GPT-4, and receive nutritional analysis (calories, protein, carbs, etc.) of it and show it on the frontend.
- User logs into the application
- User navigates to the “Log Meals” section
- User uploads a photo.
- AI processes the photo and generates a nutritional analysis.
- Nutritional analysis appears in the frontend.
- User can modify, copy, or export the nutritional analysis.

5.2. Users can view a dynamic nutrition dashboard from React Native with Java/SpringBoot backend using mongoDB database, showing their daily and weekly intake of calories, carbs, and protein.
- User logs into the application.
- User navigates to the “Dashboard” section.
- User’s past information, dietary information and caloric intake is stored in a mongoDB database and displayed on the dashboard.
- User’s caloric intake, carb intake, and protein intake across various meals throughout the week are summed up and displayed graphically. 
- Graphs are created and inputted using the frontend through React Native.
- Users can input new meals they consumed and update the information displayed.

5.3. Users receive AI-powered meal suggestions based on fridge photos, ingredient input, or personalized constraints (e.g., calorie limits, macros, budget) using GPT-4 to process the user inputs and output those inputs onto React Native.
- User logs into the application.
- User  navigates to the “AI Meal Suggestion” section.
- User uploads a photo of his ingredients in the fridge.
- GPT-4 processes the photo of the ingredients and generates a personalized meal suggestion based on the constraints.
- Personalized meal suggestion appears in the frontend React Native.
- User can modify, copy, or export the personalized meal suggestions.

5.4. Users can discover local restaurant meals that match their dietary needs using Google Maps API and filter results by price, cuisine, or location and show to the frontend.
- User logs into the application.
- User navigates to the “Near Me” section.
- Users share their location on the app and Google Maps API is used to generate a map with the user’s pin.
- User can click the “Filter” button which gives them the option to filter by location(certain distance away), price, and cuisine. This is done using React Native. Restaurants that don’t meet the criteria are hidden.
- Users can click on a Restaurant pin to bring up information regarding it.

5.5. Users can connect with friends to view friends profiles and share meals with friends, see the achievements of the other person, and view your own progress streaks and friends’ progress streaks.
- User logs into the application.
- User navigates to the “profile” section.
- User navigates to the “friends” section.
- User can add and remove friends, view the profile of their friends where it shows the achievements of the other person and their progress streaks.

5.6. Users can connect with verified professionals to share meals, view profiles, and get guidance from dietitians or fitness coaches.
- Users log into the application. 
- Logged in users navigate to the social media section. 
- Users can see a button to "post" meals or guidance or thoughts in general, or scroll through the feed to see what other users post. 
- Users can create a post; posts can have either text or an image or both. This will update the MongoDB database so other users can see what is posted. 
- Other users can see what is posted in the social media feature. Social media feed will be updated with the latest data in our MongoDB database. 


