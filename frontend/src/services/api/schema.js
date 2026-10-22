import apiClient from "./client";

export async function addSchemaField(requestId, fieldData) {
  return apiClient(`/api/requests/${requestId}/schema`, {
    method: "POST",
    body: JSON.stringify(fieldData),
  });
}

export async function getSchemaFields(requestId) {
  return apiClient(`/api/requests/${requestId}/schema`);
}

export async function updateSchemaField(
  requestId,
  fieldId,
  fieldData
) {
  return apiClient(
    `/api/requests/${requestId}/schema/${fieldId}`,
    {
      method: "PUT",
      body: JSON.stringify(fieldData),
    }
  );
}

export async function deleteSchemaField(requestId, fieldId) {
  return apiClient(
    `/api/requests/${requestId}/schema/${fieldId}`,
    {
      method: "DELETE",
    }
  );
}