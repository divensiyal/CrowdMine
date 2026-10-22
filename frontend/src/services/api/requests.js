import apiClient from "./client";

export async function createRequest(requestData) {
  return apiClient("/api/requests/", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

export async function getMyRequests() {
  return apiClient("/api/requests/");
}

export async function getRequest(requestId) {
  return apiClient(`/api/requests/${requestId}`);
}

export async function updateRequest(requestId, requestData) {
  return apiClient(`/api/requests/${requestId}`, {
    method: "PUT",
    body: JSON.stringify(requestData),
  });
}

export async function deleteRequest(requestId) {
  return apiClient(`/api/requests/${requestId}`, {
    method: "DELETE",
  });
}

export async function publishRequest(requestId) {
  return apiClient(`/api/requests/${requestId}/publish`, {
    method: "PUT",
  });
}

export async function closeRequest(requestId) {
  return apiClient(`/api/requests/${requestId}/close`, {
    method: "PUT",
  });
}

export async function discoverRequests() {
  return apiClient("/api/requests/discover");
}