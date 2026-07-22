# Google sign-in (Firebase) — setup

A **"Continue with Google"** button appears in the login modal when Firebase is
configured. Without it, the email/password demo login still works — nothing
breaks. The Firebase SDK is code-split, so it only loads when someone clicks the
Google button.

## 1. Create a Firebase project
- Go to <https://console.firebase.google.com> → **Add project**.
- **Build → Authentication → Get started → Sign-in method → Google → Enable**,
  set a support email, Save.

## 2. Register a Web app
- **Project settings (gear) → General → Your apps → Web (`</>`)**.
- Copy the config values (`apiKey`, `authDomain`, `projectId`, `appId`).

## 3. Authorize your domains
**Authentication → Settings → Authorized domains** → add:
- `www.nammafishmart.com` (production)
- `localhost` (already present, for local dev)

Google OAuth popups only work on authorized domains.

## 4. Set the environment variables
Copy `.env.example` → `.env` locally, and add the same vars to your host (GitHub
Pages via repo/Actions secrets, Vercel, etc.):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123
```

Rebuild / redeploy. The Google button now signs users in with their Google
account; their name + email populate the account menu, and Log out clears both
the local session and the Firebase session.

## Notes
- The Firebase web config is **safe to ship** in the frontend — it's not a
  secret; access is controlled by the Authorized domains list + Firebase rules.
- This adds identity only (name/email). Orders/cart still live in the browser
  (localStorage); wire them to a backend later if you need server-side accounts.
