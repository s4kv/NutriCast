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

To get access to the NutriCast project files locally on your computer, please clone the GitHub repository using Git:

```bash
git clone https://github.com/s4kv/NutriCast.git
cd NutriCast
```

---

### Build Instructions

Since this project provides raw source code, you will need to build the backend and frontend components to create the runnable application.

### Backend Build (Spring Boot)

The backend is a Spring Boot application. We will use Maven to compile the Java code and package it into an executable JAR file.

**Steps:**

1.  **Navigate to the Backend Directory:**
    Open your terminal or command prompt and change your current directory to the `backend` folder of the project.

    ```bash
    cd backend
    ```

2.  **Execute the Maven Build Command:**
    Run the following command to clean, compile, test, and package the application.

    ```bash
    ./mvnw clean install
    ```
    * **Note for Windows Users:** If you are on Windows, use `.\mvnw.cmd clean install` instead.

**Output:**
Upon successful completion, an executable JAR file will be generated in the `backend/target/` directory. The filename will typically follow the pattern `your-application-name-X.Y.Z-SNAPSHOT.jar` (e.g., `my-project-backend-0.0.1-SNAPSHOT.jar`).

---
### Frontend Build (React Native with Expo)

The frontend is a React Native application built with Expo. We will use `npm` (Node Package Manager) or `yarn` to install the required JavaScript dependencies.

**Steps:**

1.  **Navigate to the Frontend Directory:**
    Change your current directory to the `frontend` folder of the project.

    ```bash
    cd frontend
    ```

2.  **Install Node.js Dependencies:**
    Run *one* of the following commands to download and install all necessary JavaScript packages.

    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Resolve Peer Dependency Conflicts (Optional):**
    If you encounter peer dependency conflicts during the `npm install` process, you can try running the following command to force the installation, potentially using older but compatible package versions:

    ```bash
    npm install --legacy-peer-deps
    ```

---

### Installation of Application

The "installation" process for NutriCast varies depending on whether you're using our pre-deployed backend or running a local instance.

### For Running with the Deployed Backend (Recommended for Customers)

For most users, especially customers, no traditional "installation" is required. You'll primarily interact with the frontend application.

**Steps:**

1.  **Install Expo Go:** Ensure you have the **Expo Go app** installed on your mobile device.
2.  **Frontend Code:** You'll need the frontend code configured to connect to our pre-deployed backend server. This connection is established via the `BACKEND_API_URL` environment variable, which you would have set up.

### For Running Backend Locally (for Development or Custom Deployment)

If you have already built the backend JAR file as described in the "Backend Build" section, the resulting `.jar` file is self-contained.

**Steps:**

1.  **Placement:** There are no specific directory requirements for "installation." Simply place the built `.jar` file wherever you intend to run it. This could be:
    * On a server
    * Within a virtual machine
    * Directly on your development machine

### Deployment to Google Cloud Platform (GCP)

If you plan to deploy the backend to Google Cloud Platform yourself (e.g., to Google App Engine, Cloud Run, or Compute Engine), you'll follow Google Cloud's specific deployment procedures for Java Spring Boot applications.

**Typical Process:**

1.  **`gcloud` CLI:** You would generally use the `gcloud` command-line interface (CLI), as noted in the prerequisites for the project.
2.  **Deployment Commands:** This usually involves commands such as `gcloud app deploy` or configuring a CI/CD pipeline to automate the deployment process. Refer to Google Cloud's official documentation for detailed instructions on deploying Spring Boot applications to your chosen GCP service.

---

### Run Instructions

Here are the instructions to execute the NutriCast application based on your chosen setup:

#### Run Frontend with Deployed Backend (Recommended for Customers)

This is the simplest way to experience NutriCast.

**Steps:**

1.  **Configure Backend URL:** Ensure you have configured the **`BACKEND_API_URL`** in your `.env` file to point to our deployed backend endpoint (e.g., `https://your-deployed-backend-url.example.com`).
2.  **Navigate to Frontend:** Open your terminal and go to the `frontend` directory.

    ```bash
    cd frontend
    ```

3.  **Start Expo Development Server:** Run the following command to start the Expo server.

    ```bash
    npx expo start
    ```

4.  **Launch the App:**
    * **On your physical mobile device:** Open the **Expo Go app** and scan the QR code displayed in your terminal or web browser (which usually opens automatically at `http://localhost:8081`). The NutriCast app should then load on your phone.
    * **On a web browser (for quick testing):** Press `w` in the terminal where `npx expo start` is running to open the web version in your default browser.

#### Run Locally (for Development)

If you've built the backend locally and want to run both the frontend and backend on your machine, follow these steps:

##### Start the Backend

1.  **Navigate to Backend Directory:** Go to the `backend` directory, or specifically to the `target` directory where your JAR file is located.

    ```bash
    cd backend/target # Or wherever your JAR is located
    ```

2.  **Run the Executable JAR:** Execute the built JAR file.

    ```bash
    java -jar your-backend-application-name.jar # Replace with actual JAR name, e.g., nutricast-backend-0.0.1-SNAPSHOT.jar
    ```
    * **Important:** Make sure your local **MongoDB instance is running** before starting the backend.
    The backend should start on `http://localhost:8080` (or whatever port you've configured).

##### Start the Frontend

1.  **Open New Terminal:** Open a separate terminal window.
2.  **Navigate to Frontend Directory:** Go to the `frontend` directory.

    ```bash
    cd frontend
    ```

3.  **Configure Local Backend URL:** Ensure you have configured **`BACKEND_API_URL`** in your `backend.ts` file to point to your local backend (e.g., `http://localhost:8080`).
4.  **Start Expo Development Server:** Run the Expo server.

    ```bash
    npx expo start
    ```

5.  **Launch the App:**
    * **On your physical mobile device:** Open the **Expo Go app** and scan the QR code displayed in your terminal or web browser.
    * **On a web browser:** Press `w` in the terminal to open the web version.

---

### Troubleshooting

Here are some common issues you might encounter during setup or when running the application, along with their corrective actions:

#### `npm install` errors due to peer dependency conflicts

* **Issue:** `npm install` fails with warnings or errors related to conflicting peer dependencies in `package.json`.
* **Corrective Action:** Rerun the installation command with the `--legacy-peer-deps` flag. This command helps resolve conflicts by installing compatible, potentially older, versions of packages.

    ```bash
    npm install --legacy-peer-deps
    ```

#### Frontend not updating or strange behavior after changes

* **Issue:** Changes you've made to the frontend code aren't reflected, or the app behaves unexpectedly.
* **Corrective Action:** Clear the Expo development cache by running the start command with the `-c` flag. This ensures a fresh build and clears any cached assets.

    ```bash
    npx expo start -c
    ```

#### Backend failed to start / MongoDB Connection Issues

* **Issue:** The Spring Boot backend fails to start, often with errors indicating it cannot connect to MongoDB.
* **Corrective Action:**
    * Ensure your **MongoDB instance is running** (locally or accessible from your cloud provider).
    * Verify that the **`MONGODB_URI`** in your system environment variables (and `.env` file if applicable) is correct and points to the right database.
    * Check **firewall settings** if MongoDB is running on a remote server.

#### AI features (e.g., meal analysis) not working or returning errors

* **Issue:** Features relying on OpenAI or Gemini APIs are non-functional or throw authentication/API errors.
* **Corrective Action:**
    * Double-check that your **`OPENAI_API_KEY`** and **`GEMINI_API_KEY`** are correctly set in your system environment variables and `.env` file.
    * Ensure your **API keys are valid** and have not expired or exceeded rate limits on the respective platforms (OpenAI, Google Cloud).
    * Verify **network connectivity** from your backend to the AI service endpoints.

#### Frontend cannot connect to backend (local or deployed)

* **Issue:** The mobile app shows network errors or fails to fetch data from the backend.
* **Corrective Action:**
    * Verify that the **`BACKEND_API_URL`** in your `.env` file is set correctly.
    * If using the deployed backend, ensure the **URL is active and accessible**.
    * If running the backend locally, ensure the **backend Spring Boot application is running** and accessible on `http://localhost:8080` (or its configured port). Check for any **firewall rules** blocking connections.

---
