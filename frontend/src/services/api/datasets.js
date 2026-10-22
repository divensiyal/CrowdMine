import apiClient from "./client";

export async function getDatasets() {
  return apiClient("/api/datasets/");
}

export async function getDataset(datasetId) {
  return apiClient(`/api/datasets/${datasetId}`);
}

export async function updateDataset(datasetId, datasetData) {
  return apiClient(`/api/datasets/${datasetId}`, {
    method: "PUT",
    body: JSON.stringify(datasetData),
  });
}

export async function deleteDataset(datasetId) {
  return apiClient(`/api/datasets/${datasetId}`, {
    method: "DELETE",
  });
}

export async function createDataset(datasetData) {
  return apiClient("/api/datasets/", {
    method: "POST",
    body: JSON.stringify(datasetData),
  });
}

export async function grantDatasetAccess(datasetId, userId) {
  return apiClient(`/api/datasets/${datasetId}/access`, {
    method: "POST",
    body: JSON.stringify({
      user_id: Number(userId),
    }),
  });
}

export async function revokeDatasetAccess(datasetId, userId) {
  return apiClient(
    `/api/datasets/${datasetId}/access/${userId}`,
    {
      method: "DELETE",
    }
  );
}