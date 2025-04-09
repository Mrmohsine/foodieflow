import React, { useEffect, useState } from "react";
import {
  createDocument,
  readDocuments
} from "./firebase/firebase-config"; 

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    const usersData = await readDocuments("users");
    setUsers(usersData);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    await createDocument("users", form);
    setForm({ name: "", email: "" });
    fetchUsers(); // Refresh list
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">User Manager</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Users List</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-3 border rounded flex justify-between items-center"
          >
            <span>
              {user.name} — <span className="text-gray-600">{user.email}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;