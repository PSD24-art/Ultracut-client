// src/pages/UserPage.jsx
import React, { useEffect, useState } from "react";
import fetchFn from "../utility/FetchFn"; // update path if needed
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function UserPage() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [logOut, setLogOut] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {}, [logOut]);
  const loadUser = async () => {
    try {
      const data = await fetchFn("/user/me", "GET");
      if (data.user) setUser(data.user);
    } catch (err) {
      console.log("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        {/* HEADER */}
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{user.name}</h1>
            <p className="text-gray-600 text-sm">{user.email || "No email"}</p>
          </div>
        </div>

        {/* USER DETAILS */}
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="text-lg font-medium">{user.phone}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="text-lg font-medium text-green-600">Active</p>
          </div>

          <div className="pt-4 border-t">
            <button className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">
              Edit Profile
            </button>
          </div>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
            onClick={async () => {
              const isConfirm = confirm("Are you sure want to logout?");
              if (!isConfirm) return;
              await logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
