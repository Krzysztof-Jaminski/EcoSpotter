# EcoSpotter - Firebase Studio App

Welcome to EcoSpotter! This application allows users to discover, map, and learn about important trees in their area. It features an AI assistant to provide ecological advice and help with identifying trees.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and configured for Firebase Studio.

## Getting Started

Follow these instructions to get the project set up and running on your local machine.

### Prerequisites

- Node.js (v18 or later recommended)
- A Google account to create a Firebase project
- `pnpm` package manager (or `npm`/`yarn`)

### 1. Firebase Project Setup

You'll need a Firebase project to handle the backend, including authentication, database, and storage.

1.  **Create a Firebase Project:**
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Click "Add project" and follow the on-screen instructions to create a new project.

2.  **Create a Web App:**
    - In your new project's dashboard, click the Web icon (`</>`) to add a new web app.
    - Give your app a nickname (e.g., "EcoSpotter Web").
    - You don't need to set up Firebase Hosting at this stage.
    - After creating the app, Firebase will show you your configuration credentials. You will need these for your environment file.

3.  **Enable Firebase Services:**
    - In the Firebase Console, navigate to the "Build" section in the left-hand menu.
    - **Authentication:**
        - Go to **Authentication** > **Sign-in method**.
        - Enable the **Email/Password** provider.
    - **Firestore Database:**
        - Go to **Firestore Database** > **Create database**.
        - Start in **test mode**. This allows open read/write access for development. *For production, you must set up proper security rules.*
        - Choose a location for your database.
    - **Storage:**
        - Go to **Storage** > **Get started**.
        - Start in **test mode**. This allows open read/write access. *For production, you must set up proper security rules.*
        - Choose a location for your storage bucket.

### 2. Google Maps API Setup

The application uses Google Maps to display tree locations.

1.  **Get an API Key:**
    - Go to the [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project or select an existing one.
    - In the navigation menu, go to **APIs & Services** > **Credentials**.
    - Click **+ CREATE CREDENTIALS** and select **API key**.
    - Copy your new API key. You'll need it for the environment file.

2.  **Enable Required APIs:**
    - In the navigation menu, go to **APIs & Services** > **Library**.
    - Search for and enable the following APIs:
        - **Maps JavaScript API**
        - **Places API**
        - **Geocoding API**

3.  **Secure Your API Key (Recommended):**
    - Go back to **APIs & Services** > **Credentials**.
    - Click on your API key to edit it.
    - Under **Application restrictions**, select **HTTP referrers (web sites)**.
    - Add your development URL (e.g., `localhost:9002/*`) and your future production URL. This prevents others from using your key on their websites.

### 3. Environment Variables

Create a file named `.env.local` in the root of the project. Copy the contents of `.env.local.example` and fill in the values from the previous steps.

```bash
# .env.local

# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_PROJECT_ID.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_PROJECT_ID.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
```

### 4. Install Dependencies and Run

Now you can install the project dependencies and run the development server.

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

The app should now be running at [http://localhost:9002](http://localhost:9002).
