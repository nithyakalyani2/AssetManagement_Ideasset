export const BASE_URL = "http://localhost:3000";

export const apiFetch = async (
  path: string,
  options: RequestInit = {}
) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "API Error");
  }

  return res.json();
};
