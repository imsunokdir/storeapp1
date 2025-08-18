import React, { useState } from "react";
import { createNewStore } from "../../services/admin";
import GoBack from "../../components/GoBack";

const AddNewStore = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.name.length < 20 || form.name.length > 60) {
      setError("Store name must be between 20 and 60 characters");
      return;
    }
    if (form.address.length > 400) {
      setError("Address cannot exceed 400 characters");
      return;
    }
    try {
      const dataToSend = { ...form, owner_id: Number(form.owner_id) };

      const res = await createNewStore(dataToSend);
      if (res.status === 201) {
        setSuccess("Store added successfully!");
        setForm({ name: "", email: "", address: "", owner_id: "" });
      }
    } catch (err) {
      console.log(err);
      setError("Failed to add store");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* GoBack component - left side on large screens, top on small screens */}
      <div className="lg:w-auto lg:flex-shrink-0 p-2">
        <GoBack />
      </div>

      {/* Main content - right side on large screens, bottom on small screens */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Add New Store</h2>

          {error && <p className="mb-4 text-red-600">{error}</p>}
          {success && <p className="mb-4 text-green-600">{success}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Store Name (20-60 characters)"
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
              placeholder="Store Email"
              value={form.email}
              onChange={handleChange}
              required
              className="mb-4 w-full p-3 border border-gray-300 rounded"
            />

            <textarea
              name="address"
              placeholder="Store Address (max 400 characters)"
              value={form.address}
              onChange={handleChange}
              required
              maxLength={400}
              className="mb-4 w-full p-3 border border-gray-300 rounded"
            />

            <input
              type="text"
              name="owner_id"
              placeholder="Owner User ID"
              value={form.owner_id}
              onChange={handleChange}
              required
              className="mb-6 w-full p-3 border border-gray-300 rounded"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
            >
              Add Store
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewStore;
