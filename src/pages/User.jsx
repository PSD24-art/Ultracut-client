// src/pages/UserPage.jsx
import React, { useEffect, useState } from "react";
import fetchFn from "../utility/FetchFn";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import OrderHistory from "../components/OrderHistory";

export default function UserPage() {
  const { user, logout, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // initial form state — fullName & phone may be filled from user below
  const [form, setForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    pincode: "",
    state: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    isDefault: false,
  });

  // load detailed user object (addresses etc)
  async function loadUser() {
    setLoading(true);
    try {
      const data = await fetchFn("/user/me", "GET");
      if (data.user) setUser(data.user);
    } catch (err) {
      console.error("User fetch error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  // when user changes, prefill form.fullName & phone if available
  useEffect(() => {
    setForm((f) => ({
      ...f,
      fullName: user?.name || f.fullName,
      phone: user?.phone || f.phone,
    }));
  }, [user]);

  function updateField(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function handleAddAddress(e) {
    e.preventDefault();

    // simplest validation
    const fullName = (form.fullName || "").trim();
    const phone = (form.phone || "").trim();
    const addressLine1 = (form.addressLine1 || "").trim();

    if (!fullName) {
      alert("Please enter full name.");
      return;
    }
    if (!phone) {
      alert("Please enter phone number.");
      return;
    }
    if (!addressLine1) {
      alert("Please enter address line 1.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        label: form.label,
        fullName,
        phone,
        pincode: form.pincode,
        state: form.state,
        city: form.city,
        addressLine1,
        addressLine2: form.addressLine2,
        landmark: form.landmark,
        isDefault: Boolean(form.isDefault),
      };

      await fetchFn("/user/address", "POST", payload);

      alert("Address added successfully.");
      setShowForm(false);

      // clear non-prefilled fields only (keep fullName & phone as they came from user)
      setForm((prev) => ({
        ...prev,
        label: "Home",
        // keep fullName & phone as they were (user or user)
        pincode: "",
        state: "",
        city: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        isDefault: false,
      }));

      await loadUser(); // refresh addresses shown on profile
    } catch (err) {
      console.error("Add address failed", err);
      alert(err?.message || "Failed to add address");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Failed to load user data.
      </div>
    );
  }

  const addresses = Array.isArray(user.addresses) ? user.addresses : [];

  // determine whether fullName / phone should be disabled (prefilled from user)
  const fullNamePrefilled = Boolean(user?.name);
  const phonePrefilled = Boolean(user?.phone);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">
        {/* header */}
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            {user.name?.[0]?.toUpperCase() ||
              user?.name?.[0]?.toUpperCase() ||
              "U"}
          </div>
          <div>
            <h1 className="text-xl font-semibold">
              {user.name || user?.name || "User"}
            </h1>
            <p className="text-gray-600 text-sm">
              {user.email || user?.email || "No email"}
            </p>
          </div>
        </div>

        {/* basic info + actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-lg font-medium">
              {user.phone || user?.phone || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Account</p>
            <p className="text-lg font-medium text-green-600">Active</p>
          </div>

          <div className="text-right">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
              onClick={async () => {
                const isConfirm = confirm("Are you sure want to logout?");
                if (!isConfirm) return;
                await logout();
                navigate("/", { replace: true });
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Addresses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Addresses</h2>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                {addresses.length} saved
              </div>
              <button
                onClick={() => setShowForm((s) => !s)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                {showForm ? "Cancel" : "Add new address"}
              </button>
            </div>
          </div>

          {addresses.length === 0 ? (
            <div className="text-gray-600">No addresses saved yet.</div>
          ) : (
            <div className="space-y-3">
              {addresses.map((a) => {
                const id = a._id || a.id || a.label + (a.pincode || "");
                return (
                  <div key={id} className="border rounded-md p-3 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium">
                          {a.label}{" "}
                          {a.isDefault ? (
                            <span className="text-xs ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                              Default
                            </span>
                          ) : null}
                        </div>
                        <div className="text-sm text-gray-700">
                          {a.fullName} • {a.phone}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          {a.addressLine1}
                          {a.addressLine2 ? ", " + a.addressLine2 : ""},{" "}
                          {a.city} {a.pincode}
                        </div>
                        {a.landmark && (
                          <div className="text-xs text-gray-500 mt-1">
                            Landmark: {a.landmark}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{a.state}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add address form — shown only when user clicks "Add new address" */}
        {showForm && (
          <form onSubmit={handleAddAddress} className="space-y-3 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-gray-600">Label</label>
                <input
                  value={form.label}
                  onChange={(e) => updateField("label", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Home / Office"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Full name</label>
                <input
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Recipient name"
                  disabled={fullNamePrefilled}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Mobile number"
                  disabled={phonePrefilled}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-gray-600">Pincode</label>
                <input
                  value={form.pincode}
                  onChange={(e) => updateField("pincode", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Postal code"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">State</label>
                <input
                  value={form.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="State"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">City</label>
                <input
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="City"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Address Line 1</label>
              <input
                value={form.addressLine1}
                onChange={(e) => updateField("addressLine1", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="House, building, street"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Address Line 2 (optional)
              </label>
              <input
                value={form.addressLine2}
                onChange={(e) => updateField("addressLine2", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Area, colony, sector"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Landmark (optional)
              </label>
              <input
                value={form.landmark}
                onChange={(e) => updateField("landmark", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Near XYZ"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isDefault"
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => updateField("isDefault", e.target.checked)}
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Set as default address
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                {submitting ? "Saving…" : "Add address"}
              </button>

              <button
                type="button"
                onClick={() => {
                  // reset form (keep prefilled values if present)
                  setForm({
                    label: "Home",
                    fullName: user?.name || "",
                    phone: user?.phone || "",
                    pincode: "",
                    state: "",
                    city: "",
                    addressLine1: "",
                    addressLine2: "",
                    landmark: "",
                    isDefault: false,
                  });
                  setShowForm(false);
                }}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {/* ORDER HISTORY */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Order History</h2>
          <OrderHistory />
        </div>
      </div>
    </div>
  );

  // helper to update a field and keep form simple
  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }
}
