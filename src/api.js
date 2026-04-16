const API_BASE_URL = "";

function withAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("token");
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function login(email) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    throw new Error("Login failed. Please try again.");
  }

  return response.json();
}

export async function uploadInvoice(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: withAuthHeaders(),
    body: formData
  });

  if (!response.ok) {
    throw new Error("Upload failed. Please retry.");
  }

  return response.json();
}
