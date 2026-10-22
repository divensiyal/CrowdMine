import apiClient from "./client";

export async function getCurrentUser() {
  return apiClient("/api/users/me");
}

export async function updateCurrentUser(userData) {
  return apiClient("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}