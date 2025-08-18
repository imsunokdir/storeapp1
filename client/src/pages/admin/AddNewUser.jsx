import React, { useState } from "react";
import { createNewUser } from "../../services/admin";
import GoBack from "../../components/GoBack";

const AddNewUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "normal_user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await createNewUser(form);
      if (res.status === 201) {
        setSuccess("User added successfully!");
        setForm({
          name: "",
          email: "",
          password: "",
          address: "",
          role: "normal_user",
        });
      }
    } catch (error) {
      setError("Failed to add user");
    }
  };
  return (
    <div>
      <div className="mt-2 ml-2">
        {" "}
        <GoBack />
      </div>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New User</h2>

        {error && <p className="mb-4 text-red-600">{error}</p>}
        {success && <p className="mb-4 text-green-600">{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name (20-60 characters)"
            value={form.name}
            onChange={handleChange}
            required
            minLength={20}
            maxLength={60}
            className="mb-4 w-full p-3 border border-gray-300 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="mb-4 w-full p-3 border border-gray-300 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (8-16 chars, uppercase & special char)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            maxLength={16}
            className="mb-4 w-full p-3 border border-gray-300 rounded"
          />

          <textarea
            name="address"
            placeholder="Address (max 400 characters)"
            value={form.address}
            onChange={handleChange}
            required
            maxLength={400}
            className="mb-4 w-full p-3 border border-gray-300 rounded"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="mb-6 w-full p-3 border border-gray-300 rounded"
          >
            <option value="normal_user">Normal User</option>
            <option value="store_owner">Store Owner</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewUser;
