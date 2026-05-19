const api = import.meta.env.VITE_API_URL;

// ---- TOKEN ----
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---- PUBLIC ENDPOINTS ----
const isPublicEnpoint = (path) => {
  return [
    "auth/login",
    "auth/register",
    "cities",
    "auth/sendEmail",
    "api/common/colors",
    "api/common/sizes",
    "api/chatbot/ask",
    
    "api/products",
    "auth/social-login",
    "auth/login/google",
    
    "auth/forgot/OTPRequest",
    "auth/forgot/checkOTP",
    "auth/forgot/reset"
    
  ].some(item => path.startsWith(item));
};

// ---- REFRESH TOKEN ----
export const refreshToken = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  const res = await fetch(`${api.replace(/\/$/, "")}/auth/refreshToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (res.status === 200) {
    const data = await res.json();
    localStorage.setItem("accessToken", data.result.token);
    return data.result.token;
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("profile");
  return null;
};

// ---- FETCH WITH RETRY ----
const fetchWithAuthRetry = async (path, options = {}, retryCount = 1) => {
  const fullUrl = `${api.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const isFormData = options.body instanceof FormData;

  // 🔥 GIỮ LẠI HEADERS GỐC → KHÔNG BAO GIỜ GHI ĐÈ
  const baseHeaders = options.headers || {};

  const finalHeaders = {
    ...baseHeaders,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(isPublicEnpoint(path) ? {} : getAuthHeaders())
  };

  options.headers = finalHeaders;

  const res = await fetch(fullUrl, options);

  let data = null;
  try { data = await res.json(); } catch {}

  return { status: res.status, data };
};

// ---- METHODS ----
export const get = async (path) => {
  return fetchWithAuthRetry(path, {
    method: "GET",
    credentials: "include",
  });
};

export const post = async (path, body) => {
  const isFormData = body instanceof FormData;

  return fetchWithAuthRetry(path, {
    method: "POST",
    credentials: "include",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? body : JSON.stringify(body),
  });
};

export const patch = async (path, body) => {
  const isFormData = body instanceof FormData;

  return fetchWithAuthRetry(path, {
    method: "PATCH",
    credentials: "include",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? body : JSON.stringify(body),
  });
};

export const del = async (path, body) => {
  return fetchWithAuthRetry(path, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  });
};

export const verifyToken = async (path, token) => {
  return fetchWithAuthRetry(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(token)
  });
};
export const getBlob = async (path) => {
  const fullUrl = `${api.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const res = await fetch(fullUrl, {
    method: "GET",
    headers: {
      ...getAuthHeaders(), // ✅ vẫn có JWT
    },
  });

  if (!res.ok) {
    throw new Error("Download failed");
  }

  const blob = await res.blob();
  return blob;
};

