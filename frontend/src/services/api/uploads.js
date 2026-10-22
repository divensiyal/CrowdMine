export async function uploadContributionFile(
  requestId,
  file
) {
  const storedAuth =
    localStorage.getItem("crowdmine_auth");

  let token = null;

  if (storedAuth) {
    try {
      const authData = JSON.parse(storedAuth);
      token = authData.token;
    } catch {
      token = null;
    }
  }

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/uploads/?request_id=${requestId}`,
    {
      method: "POST",
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
      body: formData,
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    let message = "File upload failed.";

    if (typeof data?.detail === "string") {
      message = data.detail;
    } else if (typeof data?.error?.message === "string") {
      message = data.error.message;
    } else if (data?.detail) {
      message = JSON.stringify(data.detail);
    } else if (data?.error) {
      message = JSON.stringify(data.error);
    }

    const error = new Error(message);

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}