/**
 * Optional Firebase Google sign-in.
 *
 * The site works fully WITHOUT Firebase (the email/password demo login still
 * works). When these env vars are set, a "Continue with Google" button appears
 * in the login modal and signs users in with their Google account.
 *
 *   VITE_FIREBASE_API_KEY=...
 *   VITE_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
 *   VITE_FIREBASE_PROJECT_ID=...
 *   VITE_FIREBASE_APP_ID=...
 *
 * The Firebase SDK is dynamically imported so it is NOT in the main bundle —
 * it only loads when someone actually clicks "Continue with Google".
 */
const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as
    | string
    | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as
    | string
    | undefined,
};

export const isFirebaseConfigured = Boolean(
  cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId
);

export type GoogleProfile = { name: string; email: string };

/* eslint-disable @typescript-eslint/no-explicit-any */
let authPromise: Promise<any> | null = null;
async function getAuth() {
  if (!isFirebaseConfigured) throw new Error("not-configured");
  if (!authPromise) {
    authPromise = (async () => {
      const [{ initializeApp, getApps, getApp }, { getAuth }] =
        await Promise.all([import("firebase/app"), import("firebase/auth")]);
      const app = getApps().length ? getApp() : initializeApp(cfg as any);
      return getAuth(app);
    })();
  }
  return authPromise;
}

/** Opens the Google sign-in popup and resolves the user's name + email. */
export async function signInWithGoogle(): Promise<GoogleProfile> {
  const auth = await getAuth();
  const { GoogleAuthProvider, signInWithPopup } = await import(
    "firebase/auth"
  );
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const res = await signInWithPopup(auth, provider);
  const u = res.user;
  return {
    name: u.displayName || u.email?.split("@")[0] || "Friend",
    email: u.email || "",
  };
}

/** Sign out of Firebase (best-effort; local session is cleared by the store). */
export async function firebaseSignOut(): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    const auth = await getAuth();
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
  } catch {
    /* ignore */
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
