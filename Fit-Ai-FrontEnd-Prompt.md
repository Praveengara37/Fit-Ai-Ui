Complete the remaining authentication and profile pages for FitAI web app.

PAGES TO BUILD:

1. src/app/register/page.tsx
   - Sign up form (email, password, confirmPassword, fullName)
   - Validation with Zod
   - Call POST /api/auth/register
   - Set cookie and redirect to /profile/setup
   - Link to login page

2. src/app/dashboard/page.tsx
   - Protected route (check auth)
   - Welcome message with user's name
   - Show fitness goal summary
   - Navigation to profile, meals, workouts (coming soon)
   - Logout button

3. src/app/profile/setup/page.tsx
   - First-time profile setup form
   - Fields: dateOfBirth, gender, heightCm, currentWeightKg, targetWeightKg, fitnessGoal, activityLevel, dietaryPreference
   - Call POST /api/profile/setup
   - Redirect to /dashboard after completion

4. src/app/profile/page.tsx
   - Protected route
   - Display all user info + profile data
   - Edit button → opens edit mode
   - Change password button → modal
   - Call GET /api/profile/me

5. src/app/profile/edit/page.tsx
   - Edit profile form (pre-filled with current data)
   - Call PATCH /api/profile/update
   - Redirect back to /profile

USE SAME DESIGN:
- Dark theme (#1a1625 background)
- Purple/cyan colors (#a855f7, #22d3ee)
- Glass-morphism cards
- Gradient buttons
- Same styling as login page

BACKEND ENDPOINTS (already exist):
- POST /api/auth/register
- GET /api/auth/verify
- POST /api/profile/setup
- GET /api/profile/me
- PATCH /api/profile/update
- POST /api/auth/logout
- POST /api/auth/change-password

Create all 5 pages now with proper routing, auth checks, and error handling.