import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  updatePassword
} from "firebase/auth";

import { firebaseConfig, db, app } from "./firebase-config"; 
import { doc, setDoc } from "firebase/firestore";
import { initializeApp, deleteApp } from "firebase/app";
import { toast } from 'react-hot-toast';
import React from "react";
import { Navigate, useNavigate } from "react-router";

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
    // show red toast
    toast.error(`Sign Up Error: ${error.message}`);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user.uid;
  } catch (error) {
    toast.error(`Email or password are incorrect,Try again`);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    <Navigate to="/login" />;
  } catch (error) {
    toast.error(`Sign Out Error: ${error.message}`);
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
    toast.error(`Error during signUpWithoutLogin: ${error.message}`);
    throw error;
  } finally {
    await tempAuth.signOut();
    await deleteApp(tempApp);
  }
};

export const updateUserPasswordWithoutLogin = async (email, oldPassword, newPassword) => {
  if (!oldPassword) {
    toast.error("Old password is required to update the password");
    throw new Error("Old password is required to update the password");
  }

  const tempApp = initializeApp(firebaseConfig, "SecondaryUpdate");
  const tempAuth = getAuth(tempApp);

  try {
    const userCredential = await signInWithEmailAndPassword(tempAuth, email, oldPassword);
    await updatePassword(userCredential.user, newPassword);
    toast.success("Password updated successfully");  // optional positive feedback
    return true;
  } catch (error) {
    toast.error(`Error updating password: ${error.message}`);
    throw error;
  } finally {
    await tempAuth.signOut();
    await deleteApp(tempApp);
  }
};

export { auth };
