import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { signUpWithoutLogin, signIn,  auth } from "../../firebase/firebase-auth";
import { option } from "framer-motion/client";
import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
// import { useUser ,useFirestoreUser} from "../context/users";
import { useFirestoreUser } from "../../User_crud/users_crud";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { useUsersByAdmin } from '../context/usersByAdmin';
import { X } from "lucide-react";

export default function AnimatedForm({ setIsOpen }) {
  const [refreshKey, setRefreshKey] = useState(true);
  const {user,setCount,count} = useUsersByAdmin();
  const navigate = useNavigate();
    const { firebaseUser, firestoreUser } = useFirestoreUser();
    const [role,setrole] = useState();
    const [credentials, setCredentials] = useState({ role: "", fullName: "", email: "", password: "" });
    const [isLoginMode, setIsLoginMode] = useState(true);
    const roles = ['client','reception','kitchen','supplier'] ;
    const handleChange = (e) => {
      setCredentials({
        ...credentials,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (isLoginMode) {
            await signUpWithoutLogin(credentials.email, credentials.password, credentials.fullName, credentials.role,firebaseUser.uid);
            // await signUp(credentials.email, credentials.password, credentials.fullName,credentials.role);
            setCount(count + 1);
            setIsOpen(false);
          }
    } catch (error) {
        alert(error.message);
    }
    };
  return (
    <>
    <motion.div
        className="min-h-[50%] flex items-center justify-center absolute w-full top-0 left-0 h-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ backgroundColor : 'transparent',backdropFilter: 'blur(7px)' }}
        >
        <motion.div
            className="bg-white p-6 max-w-md w-full rounded mx-4 shadow-md shadow-orange-500 "
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
        >
       <div className="flex flex-row items-center justify-between mb-6 ">
       <h1 className="text-3xl font-bold text-center text-orange-600">
          Bienvenue
        </h1>
        <button onClick={()=> setIsOpen(false)}>
        <X className="w-6 h-6 text-gray-500" />
        </button>
       </div>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1}}
        >
          <>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={credentials.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="hidden"
              name="role"
              value={credentials.role}
              onChange={handleChange}
            />
          </>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={credentials.password}
            onChange={handleChange}
            required
          />
            <Listbox value={credentials.role} onChange={(value) => handleChange({ target: { name: "role", value } })}>
              <div className="relative w-full">
                <Listbox.Button className="relative w-full cursor-pointer rounded border border-orange-300 bg-white py-2 pl-3 pr-10 text-left text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-sm">
                  <span className="block truncate">
                    {credentials.role ? credentials.role.charAt(0).toUpperCase() + credentials.role.slice(1) : credentials.role = roles[0]}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {roles.map((role) => (
                    <Listbox.Option
                      key={role}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? "bg-orange-100 text-orange-900" : "text-gray-900"
                        }`
                      }
                      value={role}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
                              <Check className="h-4 w-4" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
          > 
            Créer
          </button>
        </motion.form>
      </motion.div>
    </motion.div>
    </>
  );
}
