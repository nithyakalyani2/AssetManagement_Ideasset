import { apiFetch, BASE_URL } from "./endpoints";

export interface AssetReplacementPayload {
  userId: number;
  currentAssetId: number;
  category: string;
  subject?: string;
  description?: string;
  priority?: string;
  image?: File;
}

// Response types for GET /asset-replacements
export interface AssetReplacementUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssetReplacementAsset {
  id: number;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiryDate: string;
  status: string;
  condition: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetReplacementResponse {
  id: number;
  category: string;
  subject: string;
  description: string;
  priority: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: AssetReplacementUser; // Optional - not returned by /user/{id} endpoint
  currentAsset: AssetReplacementAsset;
}

export const employeeApis = {
  login: (email: string, password: string) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  submitAssetReplacement: async (payload: AssetReplacementPayload) => {
    const formData = new FormData();

    // Required fields
    formData.append("userId", payload.userId.toString());
    formData.append("currentAssetId", payload.currentAssetId.toString());
    formData.append("category", payload.category);

    // Optional fields - send empty string if not provided
    formData.append("subject", payload.subject || "");
    formData.append("description", payload.description || "");
    formData.append("priority", payload.priority || "");

    // Image file (optional)
    if (payload.image) {
      formData.append("image", payload.image);
    }

    const res = await fetch(`${BASE_URL}/asset-replacements`, {
      method: "POST",
      body: formData,
      // Note: Don't set Content-Type header - browser will set it automatically with boundary for FormData
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Failed to submit complaint");
    }

    return res.json();
  },

  // GET /asset-replacements/user/{userId} - Fetch complaints for a specific user
  getMyComplaints: async (userId: number): Promise<AssetReplacementResponse[]> => {
    return apiFetch(`/asset-replacements/user/${userId}`, {
      method: "GET",
    });
  },

  // GET /asset-replacements - Fetch all asset replacements (Admin view)
  getAllAssetReplacements: async (): Promise<AssetReplacementResponse[]> => {
    return apiFetch("/asset-replacements", {
      method: "GET",
    });
  },

  // PATCH /asset-replacements/{id}/status - Update status (approve/reject)
  updateAssetReplacementStatus: async (
    id: number,
    status: "approved" | "rejected",
    reason?: string
  ): Promise<AssetReplacementResponse> => {
    const body: { status: string; reason?: string } = { status };
    if (reason) {
      body.reason = reason;
    }
    return apiFetch(`/asset-replacements/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },
};
