/*
Date Created: 12/02/2025
Modified Date: 01/20/2026
Author: William Fox
Filename: Auth.js
Files Required: None
Description:
API Calls: 10.2.2.45:4000


 */


/*  API Call for Vite */
const API_BASE = import.meta.env.VITE_API_BASE || "http://hawkgirl:4000";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export function getToken() {
    return localStorage.getItem("authToken");
}

export function setToken(token) {
    localStorage.setItem("authToken", token);
}

export function clearAuth() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
}

export function logout() {
    clearAuth();
}

export async function login(emailOrUsername, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.message || "Login failed");

    setToken(data.token);
    localStorage.setItem("authUser", JSON.stringify(data.user));
    return data.user;
}

export async function fetchMe() {
    const token = getToken();
    if (!token) throw new Error("No token");

    const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.message || "Not authorized");
    return data.user;
}
