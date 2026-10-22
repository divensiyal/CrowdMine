const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiClient(endpoint, options = {}) {
  const storedAuth = localStorage.getItem("crowdmine_auth");

  let token = null;

  if (storedAuth) {
    try {
      const authData = JSON.parse(storedAuth);
      token = authData.token;
    } catch {
      token = null;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...options.headers,
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.detail ||
        data?.error?.message ||
        "Something went wrong with the request."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

export default apiClient;