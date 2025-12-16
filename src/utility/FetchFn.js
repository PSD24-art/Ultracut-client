// src/utility/FetchFn.js
const API_BASE = import.meta.env.VITE_BASE_URL || "";

export default async function fetchFn(
  path,
  method = "GET",
  body = null,
  opts = {},
) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };

  const fetchOpts = {
    method,
    headers,
    credentials: "include",
  };

  if (body) fetchOpts.body = JSON.stringify(body);

  const res = await fetch(url, fetchOpts);

  // If 401, clear local token if you store one (optional)
  if (res.status === 401) {
    localStorage.removeItem("token");
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = data?.message || res.statusText || "Request failed";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
