import apiClient from "./client";

export async function getApiHealth() {
  return apiClient("/api/health");
}