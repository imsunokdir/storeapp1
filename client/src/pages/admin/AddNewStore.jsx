import React, { useState, useEffect } from "react";
import { createNewStore, getStoreOwner } from "../../services/admin";
import GoBack from "../../components/GoBack";
import LoadingButton from "../../components/loading/LoadingButton"; // ✅ import

const AddNewStore = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });
  const [ownerQuery, setOwnerQuery] = useState("");
  const [ownerSuggestions, setOwnerSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loading for submit

  // fetch owners when query changes
  useEffect(() => {
    if (ownerQuery.trim().length < 1) {
      setOwnerSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoadingOwners(true);
        const { data } = await getStoreOwner(ownerQuery);
        setOwnerSuggestions(data);
      } catch (err) {
        console.error("Error fetching owners:", err);
      } finally {
        setLoadingOwners(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [ownerQuery]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // start loading

    if (form.name.length < 20 || form.name.length > 60) {
      setError("Store name must be between 20 and 60 characters");
      setLoading(false);
      return;
    }
    if (form.address.length > 400) {
      setError("Address cannot exceed 400 characters");
      setLoading(false);
      return;
    }
    if (!form.owner_id) {
      setError("Please select a store owner");
      setLoading(false);
      return;
    }

    try {
      const dataToSend = { ...form, owner_id: Number(form.owner_id) };

      const res = await createNewStore(dataToSend);
      if (res.status === 201) {
        setSuccess("Store added successfully!");
        setForm({ name: "", email: "", address: "", owner_id: "" });
        setOwnerQuery("");
        setOwnerSuggestions([]);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to add store");
    } finally {
      setLoading(false); // stop loading
    }
  };

  const handleOwnerSelect = (owner) => {
    setForm((prev) => ({ ...prev, owner_id: owner.id }));
    setOwnerQuery(`${owner.name} (${owner.email})`);
    setOwnerSuggestions([]);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:w-auto lg:flex-shrink-0 p-2">
        <GoBack />
      </div>

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

            {/* 🔹 Owner search field */}
            <div className="relative mb-6">
              <label className="block mb-2 font-medium text-gray-700">
                Select Store Owner
              </label>
              <input
                type="text"
                placeholder="Search owner by name or email"
                value={ownerQuery}
                onChange={(e) => setOwnerQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded"
              />
              {loadingOwners && (
                <p className="text-sm text-gray-500 mt-1">Searching...</p>
              )}
              {ownerSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
                  {ownerSuggestions.map((owner) => (
                    <li
                      key={owner.id}
                      onClick={() => handleOwnerSelect(owner)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {owner.name} ({owner.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ✅ Replace button with LoadingButton */}
            <LoadingButton
              type="submit"
              text="Add Store"
              loadingText="Adding..."
              loading={loading}
              fullWidth
              color="primary"
              variant="contained"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewStore;
