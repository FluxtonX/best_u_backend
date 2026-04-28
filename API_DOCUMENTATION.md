# Best-U App: Backend & API Plan

This document outlines the complete backend architecture, custom APIs, and third-party APIs required for the **Best-U** fitness application.

## 1. Third-Party APIs

Since we are planning to use third-party services for specific tasks like authentication and payments, here is the list of services we will integrate:

1. **Firebase Authentication**
   * **Purpose**: To handle user sign-ups, logins, password resets, and social logins securely.
   * **How it works with Custom Backend**: The mobile app will authenticate directly with Firebase. Firebase will return an `ID Token`. The app will pass this token in the `Authorization` header to our Custom Backend. The backend will verify this token using Firebase Admin SDK to ensure the user is valid before serving data.

2. **RevenueCat / Stripe (Optional but recommended for Subscriptions)**
   * **Purpose**: To handle premium workout plans and in-app subscriptions.
   * **How it works**: Manages Apple/Google pay subscriptions and updates our backend via Webhooks when a user upgrades or cancels.

3. **Cloud Storage (AWS S3 / Firebase Storage / Cloudinary)**
   * **Purpose**: To store user profile pictures and potentially video/image assets for exercises.

---

## 2. Custom Backend APIs

We need to build a custom backend (e.g., using Node.js/Express, Python/FastAPI, or Firebase Cloud Functions) to manage user data, workout plans, and progress tracking.

### Base URL: `https://api.best-u.com/v1`

### **A. User & Profile Management**
These APIs manage user onboarding and profile data.

| Endpoint | Method | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/users/onboarding` | `POST` | Save user's initial data after signup. | `{ targetWeight, currentWeight, fitnessLevel, goals }` | `{ success: true, user: {...} }` |
| `/users/profile` | `GET` | Fetch user profile data and settings. | `Header: Bearer <Firebase_Token>` | `{ name, email, avatar, goals }` |
| `/users/profile` | `PUT` | Update user profile details. | `{ name, avatarUrl, weight, etc. }` | `{ success: true, updatedData: {...} }` |

### **B. Dashboard (Home Screen)**
APIs to power the dashboard screen summaries.

| Endpoint | Method | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/dashboard/summary` | `GET` | Get current week progress, today's workout, and weekly stats. | `Header: Bearer <Token>` | `{ weekProgress: "2/8", streak: 5, weightProgress: "-2.5kg", todaysWorkout: { id, title, duration, exercisesCount } }` |
| `/quotes/daily` | `GET` | Fetch the motivational quote of the day. | - | `{ quote: "...", author: "..." }` |

### **C. Workout Plans & Programs**
APIs for the "Workout Plan" screen, fetching structured workout routines.

| Endpoint | Method | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/programs/active` | `GET` | Get the user's current program (e.g., 8 Week Program) and overall progress. | `Header: Bearer <Token>` | `{ programName, progressPercentage, weeks: [ { weekNum, status, days: [...] } ] }` |
| `/workouts/:workoutId` | `GET` | Get details of a specific day's workout. | `Params: workoutId` | `{ title, duration, exercises: [ { name, sets, reps, videoUrl } ] }` |
| `/workouts/:workoutId/complete`| `POST` | Mark a workout as completed by the user. | `{ timeTaken, volumeLifted, notes }` | `{ success: true, newStreak: 6, milestonesUnlocked: [...] }` |

### **D. Progress & Tracking**
APIs for the "Progress" screen to show charts and personal bests.

| Endpoint | Method | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/progress/summary` | `GET` | Get top-level stats: total workouts, weight lost, personal bests count. | `Header: Bearer <Token>` | `{ totalWorkouts: 14, weightLost: 2.5, personalBestsCount: 12 }` |
| `/progress/weight-history` | `GET` | Get historical weight data for the line chart. | `Query: ?range=1M, 3M, 6M` | `[ { date: "2024-04-01", weight: 75 }, ... ]` |
| `/progress/weight` | `POST` | Log a new weight entry. | `{ weight: 72.5, date: "2024-04-27" }` | `{ success: true }` |
| `/progress/strength-levels`| `GET` | Get max weights for key exercises (Bench, Squat, Deadlift, etc.) for the bar chart. | `Header: Bearer <Token>` | `[ { exercise: "Bench", maxWeight: 40 }, ... ]` |
| `/progress/personal-bests` | `GET` | Get list of personal best records. | `Header: Bearer <Token>` | `[ { exercise: "Bench Press", value: "65 kg", date: "Apr 8, 2024" }, ... ]` |

### **E. Subscriptions (Premium)**
APIs for the Subscription screen.

| Endpoint | Method | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/subscriptions/status` | `GET` | Check if user has an active premium subscription. | `Header: Bearer <Token>` | `{ isPremium: true, expiryDate: "..." }` |

---

## 3. Database Schema Overview (Conceptual)
To support the above APIs, our custom backend will need a database (like PostgreSQL or MongoDB) with the following core tables/collections:

*   **Users**: Stores UUID (from Firebase), Name, Avatar, Onboarding answers.
*   **Programs**: Stores Master workout plans (e.g., "8 Week Transformation").
*   **Workouts**: Stores individual workout sessions linked to a Program.
*   **User_Progress**: Tracks completed workouts, weekly streaks, and overall completion %.
*   **Weight_Logs**: Stores date and weight entries.
*   **Personal_Bests**: Tracks the highest weight/reps achieved for specific exercises.

## 4. Next Steps for Backend Development
1. **Setup Firebase Project**: Enable Authentication (Email/Password, Google/Apple).
2. **Initialize Backend Project**: Choose a framework (Node.js/Express is recommended for quick API building) and set up routing.
3. **Connect Database**: Provision a database (PostgreSQL via Supabase/Render or MongoDB via Atlas).
4. **Implement Firebase Auth Middleware**: Create a middleware function to verify Firebase tokens on every protected API route.
5. **Develop Endpoints**: Build out the APIs documented above layer by layer.
