import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { deleteUser } from '../../User_crud/users_crud';
import { useUsersByAdmin } from '../context/usersByAdmin';
import UpdateUser from '../form/UpdateUsers';

export default function Users_dash() {
  const { users, count, setCount } = useUsersByAdmin();

  // State to manage the update modal and selected user.
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Motion variants for the table rows.
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Motion variants for action buttons.
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Updated handler for the Edit action.
  const handleEdit = (user) => {
    // Set the selected user and open the update modal.
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
    console.log('Edit user', user.id);
  };

  const handleDelete = (userId) => {
    console.log('Delete user', userId);
    deleteUser(userId, count, setCount);
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-full mx-auto rounded-lg overflow-hidden shadow-lg">
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
                          onClick={() => handleEdit(user)}
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                          whileHover="hover"
                          whileTap="tap"
                          variants={buttonVariants}
                        >
                          Edit
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
      {/* Render the update modal conditionally */}
      {isUpdateModalOpen && (
        <UpdateUser
          selectedUser={selectedUser}
          setIsOpen={setIsUpdateModalOpen}
        />
      )}
    </>
  );
}