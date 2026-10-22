import apiClient from "./client";

export async function createContribution(contributionData) {
  return apiClient("/api/contributions/", {
    method: "POST",
    body: JSON.stringify(contributionData),
  });
}

export async function getMyContributions() {
  return apiClient("/api/contributions/");
}

export async function getContribution(contributionId) {
  return apiClient(`/api/contributions/${contributionId}`);
}