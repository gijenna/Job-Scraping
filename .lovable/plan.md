

# Admin Login + Event Management

The "Add Event" button is hidden because it only shows for authenticated users. You need a simple admin login page so your team can sign in and manage events.

## Changes

### 1. Create `/admin` login page
- Simple email/password login form styled with your events brand (teal/coral/cream)
- On successful login, redirect to `/events` where the "Add Event" button will appear
- Include a logout button in the nav when authenticated

### 2. Enable email auth (auto-confirm)
- Enable auto-confirm for email signups so you don't need email verification for your small admin team
- You'll create your admin account(s) once, then just log in going forward

### 3. Add sign-up flow (one-time use)
- Include a toggle on the login page to switch between "Sign In" and "Sign Up" so you can create your initial admin account(s)

### 4. Update EventsNav
- Show a small "Admin" or logout indicator when authenticated, so you know you're logged in

### 5. Files modified
- `src/pages/AdminLogin.tsx` — new login/signup page
- `src/App.tsx` — add `/admin` route
- `src/components/events/EventsNav.tsx` — show auth state indicator
- Auth config: enable auto-confirm email signups

