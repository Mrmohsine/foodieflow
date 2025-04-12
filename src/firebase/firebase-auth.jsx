import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from "firebase/auth";

import { firebaseConfig, db, app } from "./firebase-config"; 
import { doc, setDoc } from "firebase/firestore";
import { initializeApp,deleteApp } from "firebase/app";


const auth = getAuth(app);

export const signUp = async (email, password, fullname, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCredential.user, { displayName: fullname });
    
    await setDoc(doc(db, "users", userCredential.user.uid), {
      role,
      email,
      fullName: fullname,
      createdAt: new Date().toISOString()
    });
    
    return userCredential.user;
  } catch (error) {
    console.error("Sign Up Error: ", error);
    throw error;
  }
};

// Sign In Function
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Sign In Error: ", error);
    throw error;
  }
};

// Sign Out Function
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign Out Error: ", error);
    throw error;
  }
};
export const signUpWithoutLogin = async (email, password, fullName, role, admin_id) => {
  const tempApp = initializeApp(firebaseConfig, "Secondary");
  const tempAuth = getAuth(tempApp);
  try {
    const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      fullName,
      role,
      admin_id,
      createdAt: new Date().toISOString(),
    });

    return userCredential.user;
  } catch (error) {
    console.error("Error during signUpWithoutLogin:", error);
    throw error;
  } finally {
    await tempAuth.signOut();
    await deleteApp(tempApp);
  }
};

export { auth };