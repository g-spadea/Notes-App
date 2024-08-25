import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import {
    FIREBASE_ADMIN_PRIVATE_KEY,
    FIREBASE_ADMIN_CLIENT_EMAIL,
  } from "$env/static/private";
import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public";
import { getFirestore, initializeFirestore } from "firebase-admin/firestore";

const firebaseConfig = {
    credential: cert({
        privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
        clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
        projectId: PUBLIC_FIREBASE_PROJECT_ID,
    })
};

function appExist():[boolean, App] {
  const apps = getApps();
  if (apps.length > 0)
    return [true, apps[0]!];
  else
    return [false, initializeApp(firebaseConfig)];
}

const [cond, firebaseApp]:[boolean,App] = appExist();
export const auth = getAuth(firebaseApp);

export const adminDB = cond ? getFirestore() : initializeFirestore(firebaseApp, {preferRest:true})