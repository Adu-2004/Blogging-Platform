import React, { useState, useEffect } from "react";
import { useAppContext } from '../../context/AppContext';
import toast from "react-hot-toast";

const AdminUsersDashboard = () => {
  const { axios, navigate } = useAppContext();
  const API_URL = "/api/admin/users";
  const DELETE_API = "api/admin/delete-user";
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(API_URL);
      if(data.success){
        setUsers(data.users || data);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post(API_URL, form);
      if(data.success){
        toast.success("User created successfully");
        setForm({ name: "", email: "", password: "" });
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to create user");
      }
    } catch (error) {
      toast.error(error.message || "Error creating user");
    }
  };

  const handleEdit = user => {
    setEditingId(user._id);
    setForm({ name: user.name, email: user.email, password: "" });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${API_URL}/${editingId}`, form);
      if(data.success){
        toast.success("User updated successfully");
        setEditingId(null);
        setForm({ name: "", email: "", password: "" });
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to update user");
      }
    } catch (error) {
      toast.error(error.message || "Error updating user");
    }
  };

  const handleDelete = async id => {
    try {
      const { data } = await axios.delete(`${API_URL}/${id}`);
      if(data.success){
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting user");
    }
  };

  return (
    <div className="flex-1 p-4 md:p-10 min-h-screen bg-blue-50/50">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-4 bg-white p-4 min-w-[14rem] rounded shadow cursor-pointer hover:scale-105 transition-all">
          <div>
            <p className="text-xl font-semibold text-gray-600">{users.length}</p>
            <p className="text-gray-400 font-light">Users</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow flex flex-col gap-4">
        <p className="text-lg font-semibold text-gray-700 mb-2">{editingId ? "Edit User" : "Add New User"}</p>
        <form onSubmit={editingId ? handleUpdate : handleCreate} className="flex flex-wrap gap-4">
          <input
            name="name"
            value={form.name}
            placeholder="Name"
            onChange={handleChange}
            required
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <input
            name="email"
            value={form.email}
            placeholder="Email"
            onChange={handleChange}
            type="email"
            required
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <input
            name="password"
            value={form.password}
            placeholder={editingId ? "New Password" : "Password"}
            type="password"
            onChange={handleChange}
            required
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
          >
            {editingId ? "Update" : "Add User"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setForm({ name: "", email: "", password: "" }); }}
              className="px-5 py-2 bg-gray-300 rounded font-medium hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="flex items-center gap-3 text-gray-600 mt-10 mb-4">
        <p className="text-lg font-semibold">All Users</p>
      </div>

      <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scroll-hide bg-white">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-600 text-left uppercase border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-400">No users found.</td>
              </tr>
            )}
            {users.map(user => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersDashboard;

