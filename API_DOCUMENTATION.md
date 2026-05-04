# Best-U App: Backend & API Plan (v2.0)

This document outlines the complete backend architecture, custom APIs, and third-party APIs required for the **Best-U** fitness application.

## 1. Custom Backend APIs

### Base URL: `https://api.best-u.com/v1`

### **A. User & Profile Management**
| Endpoint | Method | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/users/onboarding` | `POST` | Save user's initial data after signup. | `{ name, age, height, targetWeight, currentWeight, fitnessLevel, goals }` | `{ success: true, user: {...} }` |
| `/users/profile` | `GET` | Fetch user profile data and settings. | `Header: Bearer <Token>` | `{ name, email, avatar, age, height, goals }` |

### **B. Dashboard (Home Screen)**
| Endpoint | Method | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/dashboard/summary` | `GET` | Get weekly progress, streaks, and weight goal. | `Header: Bearer <Token>` | `{ weekProgress, streak, weightProgress, todaysWorkout }` |
| `/dashboard/quotes/daily` | `GET` | Fetch motivational quote. | - | `{ quote, author }` |

### **C. Workout Sessions & Tracking**
| Endpoint | Method | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/workouts/session/log-set` | `POST` | Log a single set (Weight x Reps) during a workout. | `{ exerciseName, weight, reps, setNumber, workoutSessionId }` | `{ success, isNewPB, oldRecord }` |
| `/workouts/exercise/history/:exerciseName` | `GET` | Get "Previous" and "Target" for a specific exercise. | `Params: exerciseName` | `{ previous, target }` |
| `/workouts/:workoutId/complete` | `POST` | Finalize a workout and update progress. | `{ timeTaken, volumeLifted }` | `{ success, newStreak, achievements: [...] }` |

### **D. Progress & Achievements**
| Endpoint | Method | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/progress/summary` | `GET` | Top level stats (Workouts, Weight Lost, PBs). | `Header: Bearer <Token>` | `{ totalWorkouts, weightLost, personalBestsCount }` |
| `/progress/personal-bests` | `GET` | List of all personal records. | `Header: Bearer <Token>` | `[ { exerciseName, value, achievedAt } ]` |
| `/progress/strength-levels` | `GET` | Bar chart data for key lifts. | `Header: Bearer <Token>` | `[ { exercise, maxWeight } ]` |

---

## 2. Database Schema (v2.0)
*   **Users**: (Updated) Added `age`, `height`.
*   **Exercise_Logs**: (New) Stores every set logged by the user.
*   **Personal_Bests**: Tracks records for "New PB" screen.
*   **Programs/Workouts**: Core structural data.
