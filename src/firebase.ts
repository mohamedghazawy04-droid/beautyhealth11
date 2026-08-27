import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific databaseId if specified in config
const configWithDbId = firebaseConfig as typeof firebaseConfig & { firestoreDatabaseId?: string };
export const db = configWithDbId.firestoreDatabaseId
  ? getFirestore(app, configWithDbId.firestoreDatabaseId)
  : getFirestore(app);

export default app;
