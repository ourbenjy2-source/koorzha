import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export async function signInWithEmail(email?: string, password?: string) {
  if (email && password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error("Error signing in:", error);
      return null;
    }
  } else {
    // Si no hay credenciales, mostrar un prompt simple
    const email = prompt('Ingrese su email:');
    const password = prompt('Ingrese su contraseña:');
    if (email && password) {
      return signInWithEmail(email, password);
    }
    return null;
  }
}

export async function registerWithEmail(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error registering:", error);
    return null;
  }
}

export async function logout() {
  return signOut(auth);
}

async function testConnection() {
  console.log("Firebase initialized for project:", firebaseConfig.projectId);
}
testConnection();
