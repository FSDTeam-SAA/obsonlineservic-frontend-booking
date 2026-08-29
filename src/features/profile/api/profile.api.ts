import { api } from "@/lib/api";
import { ProfileApiResponse, UpdateUserProfileRequest } from "../types";

export async function getMyProfile(): Promise<ProfileApiResponse> {
  const response = await api.get<ProfileApiResponse>("/user/me");
  return response.data;
}

export async function updateMyProfile(data: UpdateUserProfileRequest): Promise<ProfileApiResponse> {
  const response = await api.put<ProfileApiResponse>("/user/me", data);
  return response.data;
}

export async function uploadAvatar(file: File): Promise<ProfileApiResponse> {
  const formData = new FormData();
  formData.append("profileImage", file);
  const response = await api.post<ProfileApiResponse>("/user/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function deleteAvatar(): Promise<ProfileApiResponse> {
  const response = await api.delete<ProfileApiResponse>("/user/upload-avatar");
  return response.data;
}

export async function deleteAccount(): Promise<{ message: string; data: null }> {
  const response = await api.delete<{ message: string; data: null }>("/user/me");
  return response.data;
}
