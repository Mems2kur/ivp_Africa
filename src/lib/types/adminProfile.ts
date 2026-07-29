export interface AdminProfileData {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export const emptyAdminProfile: AdminProfileData = {
  fullName: "",
  email: "",
  phone: "",
  avatarUrl: undefined,
};