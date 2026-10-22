import apiClient from "./client";

export async function registerUser(userData) {
  return apiClient("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser(credentials) {
  return apiClient("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function logoutUser() {
  return apiClient("/api/auth/logout", {
    method: "POST",
  });
}

export async function refreshAuth() {
  return apiClient("/api/auth/refresh", {
    method: "POST",
  });
}