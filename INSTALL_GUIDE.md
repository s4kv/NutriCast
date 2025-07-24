# Installation Guide

### Prerequisites

To successfully set up and run NutriCast, please ensure your development environment meets the following specifications. **Note: If you plan to use our pre-deployed backend (recommended for quick access), some backend-specific prerequisites can be skipped.**

* **Operating System:**
    * Windows 10/11 (64-bit)
    * macOS (Intel or Apple Silicon)
    * Linux (Ubuntu, Fedora, etc., 64-bit)
* **Hardware:**
    * Minimum 8 GB RAM (16 GB recommended for smoother development, especially with multiple services and IDEs).
    * Minimum 20-30 GB free disk space (SSD recommended for performance).
    * Modern multi-core CPU.
* **For Local Backend Development (Optional - required if you intend to run or deploy the backend yourself):**
    * **Java Development Kit (JDK):**
        * **JDK 17** (strictly required). This is essential if you plan to build and run the Spring Boot backend locally.
    * **MongoDB Database:**
        * A running **MongoDB instance** (Community Edition recommended for local development).
            * You can install it locally on your machine or connect to a cloud-based instance (e.g., MongoDB Atlas).
            * Ensure MongoDB is accessible from your backend application.
    * **Google Cloud SDK (gcloud CLI):**
        * Required if you plan to interact with Google Cloud Platform services (like deploying the backend to App Engine, Compute Engine, etc.) or manage your GCP project resources from your local machine. Follow the official [Google Cloud SDK installation guide](https://cloud.google.com/sdk/docs/install).
    * **Firebase Project:**
        * You will need to create your own **Firebase Project** in the Google Firebase Console.
        * Within this project, ensure **Firebase Authentication** is enabled (e.g., Email/Password provider, Google Sign-In, etc., depending on what your app supports).
        * If your application interacts directly with **Cloud Firestore** for data storage beyond authentication, ensure Firestore is also set up in this project.
* **For Frontend Development (Required):**
    * **Node.js:**
        * **Node.js LTS version (e.g., 18.x or 20.x)**. This is required for React Native and Expo CLI.
        * **npm** (Node Package Manager) or **Yarn** (comes with Node.js installation).
    * **Mobile Development Environment:**
        * **Expo Go App:** Install the **Expo Go** app on your physical iOS or Android device from its respective app store. This app allows you to instantly run the NutriCast frontend on your phone by scanning a QR code.
        * **Expo CLI:** You'll also need to install the Expo CLI globally via npm by running: `npm install -g expo-cli`
* **Version Control:**
    * **Git:** Installed and configured on your system.

#### Environment Variables & API Keys

Before you can build and run NutriCast, you'll need to set up several API keys. These keys allow the application to connect with essential external services.

You will need the following API keys:

* **OPENAI\_API\_KEY**: For OpenAI's GPT-4o service.
* **GEMINI\_API\_KEY**: For Google's Gemini service (used in testing and specific AI features).
* **GOOGLE\_MAPS\_API\_KEY**: For Google Maps features, including restaurant location.

You should configure these keys in two places:

1.  **System Environment Variables:**
    * **Linux/macOS:** Add these lines to your shell's configuration file (e.g., `~/.bashrc`, `~/.zshrc`, or `~/.profile`), then run `source ~/.bashrc` (or your respective file) to apply changes.
    * **Windows:** Set these variables through the System Properties > Environment Variables dialog.
    * This ensures the backend (Spring Boot) can access them.

2.  **`.env` file in the Project Root:**
    * Create a file named `.env` in the root directory of the cloned project.
    * Add the following content to this file:

    ```text
    OPENAI_API_KEY=your_openai_api_key
    GEMINI_API_KEY=your_gemini_api_key
    GOOGLE_MAPS_API_KEY=your_google_maps_api_key
    ```
    * This file is primarily used by the frontend (React Native) during local development.

**Important:** Replace `your_openai_api_key`, `your_gemini_api_key`, and `your_google_maps_api_key` with your actual API keys. Ensure these keys are kept confidential and not committed to public repositories.

---

### Dependent Libraries
**For this project, we used the folowing dependencies:**
* Springboot Starter Web
* OpenAI for Java
* Jackson Databind
* Lombok
* Firebase/Firebase Admin
* Google GenAI
* Springboot Starter Data MongoDB
* React Native
* Expo
* React-map-gl
* Axios
* Expo Location
* React Native Maps
* Dotenv
* Google Maps API
* Google Cloud Tools

---

### Download Instructions

To download the project:
Clone the Github repository to get access to the files for the project locally on your computer. You can install all the necessary dependencies using npm install. If an error is raised, then add --legacy-peer-deps to the end of your npm install. This should install all the necessary packages and dependencies needed for the project. If you wish to run the project locally on your phone, you need to install the Expo app on your phone.

---

### Build Instructions

Since we are providing consumers with the raw source code, they will need to create the required executable application themselves. To do this, consumers will need to run the application from the BackendApplication.java file. This will ensure that the backend is running. Next, once they have run the backend for our application, they must navigate to the **/frontend** directory in the terminal. From here, input the following command to run the frontend for the application: npx expo start. This should run the application. To bring it up, users can scan the QR code on Expo Mobile, or press w to bring up the web version on their browser.

---

### Installation of Application

---

### Run Instructions

The customer simply has to run the BackendApplication.java file in the **/backend** directory of our project, and then run the frontend using npx expo start(as detailed previously). From here, users can use the application locally, and bring it up on mobile and on web.

---

### Troubleshooting

---
