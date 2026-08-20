import { apiFetch, apiFetchMultipart } from "./httpClient";

export interface EmployerProfile {
  id: string;
  userId: string;
  companyName: string;
  contactPerson: string | null;
  phoneNumber: string | null;
  industry: string | null;
  companySize: string | null;
  rcNumber: string | null;
  description: string | null;
  logoUrl: string | null;
  isProfileComplete: boolean;
  website: string | null;
  location: string | null;
  officeAddress: string | null;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED" | string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  companyName?: string;
  contactPerson?: string;
  industry?: string;
  companySize?: string;
  rcNumber?: string;
  website?: string;
  description?: string;
  logo?: File | null;
  location?: string;
  officeAddress?: string;
}

export const companyProfileApi = {
  // GET Profile
  async getProfile(): Promise<{ ok: boolean; data?: EmployerProfile; message?: string }> {
    // Note: using <any> temporarily so we can check the shape flexibly
    const result = await apiFetch<any>("/api/v1/employer/profile", {
      method: "GET",
    });

    if (!result.ok) {
      // If the backend returns 404 (Not Found), it might just mean the employer 
      // hasn't filled out their profile yet. We shouldn't crash the page.
      if (result.message?.toLowerCase().includes("not found") || result.message === "Something went wrong.") {
         return { 
           ok: false, 
           // Returning a specific flag or just passing the error
           message: "Profile not found. Please edit your profile to create one." 
         };
      }
      return { ok: false, message: result.message };
    }

    // FIX: The backend might return { profile: {...} } OR it might just return the object directly {...}
    const profileData = result.data?.profile ? result.data.profile : result.data;

    return { ok: true, data: profileData };
  },

  // PATCH Profile (uses apiFetchMultipart)
  async updateProfile(
    input: UpdateProfileInput
  ): Promise<{ ok: boolean; data?: EmployerProfile; message?: string }> {
    const formData = new FormData();

    if (input.companyName) formData.append("companyName", input.companyName);
    if (input.contactPerson) formData.append("contactPerson", input.contactPerson);
    if (input.industry) formData.append("industry", input.industry);
    if (input.companySize) formData.append("companySize", input.companySize);
    if (input.rcNumber) formData.append("rcNumber", input.rcNumber);
    if (input.website) formData.append("website", input.website);
    if (input.description) formData.append("description", input.description);
    if (input.location) formData.append("location", input.location);
    if (input.officeAddress) formData.append("officeAddress", input.officeAddress);

    if (input.logo) {
      formData.append("logo", input.logo);
    }

    const result = await apiFetchMultipart<{ message: string; profile: EmployerProfile }>(
      "/api/v1/employer/profile",
      formData,
      { method: "PATCH" }
    );

    if (!result.ok) {
      return { ok: false, message: result.message };
    }

    return { ok: true, data: result.data.profile, message: result.data.message };
  },
};