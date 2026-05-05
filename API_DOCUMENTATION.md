# Best-U App: Production API Documentation (v2.0)

This document outlines the production-ready REST APIs for the **Best-U** fitness application.

## Base URL: `http://localhost:5000/api/v1`

### Authentication
All routes except `/subscriptions/webhook` require a Firebase ID Token in the Authorization header.
`Authorization: Bearer <FIREBASE_ID_TOKEN>`

---

## 1. Custom Backend APIs

### **A. User & Profile Management**
| Endpoint | Method | Description | Request Body / Params |
| :--- | :--- | :--- | :--- |
| `/users/onboarding` | `POST` | Initial user setup. | `{ "name": "John", "currentWeight": 85, "targetWeight": 75, "fitnessLevel": "Intermediate", "goals": ["Weight Loss"] }` |
| `/users/profile` | `GET` | Fetch user profile. | - |
| `/users/profile` | `PUT` | Update profile. | `{ "name": "John Doe", "currentWeight": 84 }` |

### **B. Dashboard (Home Screen)**
| Endpoint | Method | Description | Request Body / Params |
| :--- | :--- | :--- | :--- |
| `/dashboard/summary` | `GET` | Home screen aggregate stats. | - |
| `/dashboard/quotes/daily` | `GET` | Fetch motivational quote. | - |

### **C. Workout Sessions & Tracking**
| Endpoint | Method | Description | Request Body / Params |
| :--- | :--- | :--- | :--- |
| `/programs` | `GET` | List available programs. | `?page=1&limit=10` |
| `/programs/active` | `GET` | Get user's active program. | - |
| `/workouts/:id` | `GET` | Get workout details. | - |
| `/workouts/:id/complete` | `POST` | Log workout completion. | `{ "timeTakenMinutes": 45, "volumeLifted": 1200 }` |
| `/session/log-set` | `POST` | Log individual exercise set. | `{ "workoutId": "...", "exercise": "Bench Press", "weight": 60, "reps": 10 }` |
| `/exercise/history/:exerciseName` | `GET` | Get history for an exercise. | - |
| `/progress/summary` | `GET` | Get total workouts, weight lost, etc. | - |
| `/progress/weight` | `POST` | Log body weight. | `{ "weight": 75.5, "date": "2023-10-01" }` |
| `/progress/sync-health` | `POST` | Sync Google/Apple Health. | `{ "source": "Google Fit", "steps": 10000, "date": "2023-10-01" }` |
| `/progress/weight-history` | `GET` | Get weight chart data. | - |
| `/progress/personal-bests` | `GET` | Get PRs for exercises. | - |
| `/progress/strength-levels` | `GET` | Get strength levels (max weights). | - |

### **D. Subscriptions & Payments**
| Endpoint | Method | Description | Request Body / Params |
| :--- | :--- | :--- | :--- |
| `/subscriptions/status` | `GET` | Get current sub status. | - |
| `/subscriptions/checkout` | `POST` | Create Stripe session. | `{ "priceId": "price_..." }` |
| `/subscriptions/portal` | `POST` | Manage subscription (Cancel/Update). | - |
| `/subscriptions/webhook` | `POST` | Stripe Webhook (Public). | Stripe Signature Header |

---

## 2. Production Standards Applied

- **Validation**: All inputs are validated using `express-validator`. Invalid inputs return `422 Unprocessable Entity`.
- **Security**: 
    - Firebase Token Verification on all private routes.
    - User-Resource Ownership: Users can only access/modify their own data.
    - Webhook Signature Verification for Stripe.
- **Pagination**: List-based APIs (`/programs`, etc.) support `page` and `limit` query parameters.
- **Error Handling**: Standardized JSON error responses for all status codes.

---

## 3. Database Models (Mongoose)

- **User**: Core profile and subscription status.
- **Program**: Workout programs structure.
- **Workout**: Daily workout routines and exercises.
- **ExerciseLog**: Individual set performance history.
- **WeightLog**: Historical weight tracking.
- **HealthLog**: Synced health data (Google Fit/Apple Health).
- **Subscription**: Detailed payment transaction records.
- **UserProgress**: Streak and active program tracking.
