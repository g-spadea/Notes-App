import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import {
    FIREBASE_ADMIN_PRIVATE_KEY,
    FIREBASE_ADMIN_CLIENT_EMAIL,
  } from "$env/static/private";
import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public";

const firebaseConfig = {
    credential: cert({
        privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
        clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
        projectId: PUBLIC_FIREBASE_PROJECT_ID,
    })
};

function makeApp() {
  const apps = getApps();
  if (apps.length > 0)
    return apps[0]!;
  else
    return initializeApp(firebaseConfig)
}

const firebaseApp: App = makeApp();
export const auth = getAuth(firebaseApp);