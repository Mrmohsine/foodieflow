import React from 'react';
import { motion } from 'framer-motion';
import { useUserByAdmin, useFirestoreUser } from '../context/users';

export default function Users_dash() {
  const { firebaseUser } = useFirestoreUser();
  const users = useUserByAdmin(firebaseUser?.uid);

  // Motion variants for the table rows.
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Motion variants for action buttons.
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Handlers for actions.
  const handleEdit = (userId) => {
    // Add your edit logic here.
    console.log('Edit user', userId);
  };

  const handleSuspend = (userId) => {
    // Add your suspend logic here.
    console.log('Suspend user', userId);
  };

  const handleDelete = (userId) => {
    // Add your delete logic here.
    console.log('Delete user', userId);
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-full mx-auto rounded-lg overflow-hidden shadow-lg ">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="py-3 px-4 uppercase font-semibold text-sm w-1/4 text-start">
                  Full Name
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm w-1/4 text-start">
                  Email
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm w-1/4 text-start">
                  Role
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm w-1/4 text-start">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <motion.tr
                    key={user.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className="hover:bg-gray-100"
                  >
                    <td className="py-3 px-4 text-start">{user.fullName}</td>
                    <td className="py-3 px-4 text-start">{user.email}</td>
                    <td className="py-3 px-4 text-start">{user.role}</td>
                    <td className="py-3 px-4 text-start space-x-2">
                      <motion.button
                        onClick={() => handleEdit(user.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => handleSuspend(user.id)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        Suspend
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-3 px-4 text-start text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}