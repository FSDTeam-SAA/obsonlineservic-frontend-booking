"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Camera, Trash2, User, Mail, Phone, Calendar, Globe, MapPin, Loader2, AlertTriangle, Shield, Check, Ticket } from "lucide-react";
import { getMyProfile, updateMyProfile, uploadAvatar, deleteAvatar, deleteAccount } from "../api/profile.api";
import { UserProfile } from "../types";
import { MyBookingsView } from "@/features/bookings/components/MyBookingsView";

export function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"profile" | "bookings">("profile");

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Account Deletion Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [cityState, setCityState] = useState("");
  const [roadArea, setRoadArea] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [taxId, setTaxId] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await getMyProfile();
        if (res.data) {
          setProfile(res.data);
          // Initialize form states
          setName(res.data.name || "");
          setUsername(res.data.username || "");
          setDob(res.data.dob ? res.data.dob.split("T")[0] : "");
          setPhone(res.data.phone || "");
          setGender(res.data.gender || "");
          setBio(res.data.bio || "");
          setLanguage(res.data.language || "");
          setCountry(res.data.country || "");
          setCityState(res.data.cityState || "");
          setRoadArea(res.data.roadArea || "");
          setPostalCode(res.data.postalCode || "");
          setTaxId(res.data.taxId || "");
        }
      } catch (err: any) {
        console.error("Failed to load user profile:", err);
        setError("Could not load your profile. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await updateMyProfile({
        name,
        username,
        dob: dob || undefined,
        phone,
        gender: gender || undefined,
        bio,
        language,
        country,
        cityState,
        roadArea,
        postalCode,
        taxId,
      });

      if (res.data) {
        setProfile(res.data);
        setSuccess("Profile updated successfully!");
        
        // Update local next-auth session display name if it changed
        if (name !== session?.user?.name) {
          await updateSession({
            ...session,
            user: {
              ...session?.user,
              name,
            },
          });
        }
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err?.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await uploadAvatar(file);
      if (res.data) {
        setProfile(res.data);
        setSuccess("Avatar uploaded successfully!");
      }
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      setError(err?.response?.data?.message || "Failed to upload avatar.");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!confirm("Are you sure you want to remove your profile picture?")) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await deleteAvatar();
      if (res.data) {
        setProfile(res.data);
        setSuccess("Avatar removed successfully!");
      }
    } catch (err: any) {
      console.error("Avatar delete error:", err);
      setError(err?.response?.data?.message || "Failed to remove avatar.");
    } finally {
      setUploading(false);
    }
  };

  const handleAccountDelete = async () => {
    if (deleteConfirmText !== "DELETE MY ACCOUNT") {
      setError("Please type 'DELETE MY ACCOUNT' to confirm account deletion.");
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await deleteAccount();
      // Sign out and redirect to home
      await signOut({ callbackUrl: "/" });
    } catch (err: any) {
      console.error("Account deletion error:", err);
      setError(err?.response?.data?.message || "Failed to delete account. Please try again.");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#3B3388]" />
        <span className="text-sm font-medium text-slate-500">Loading your profile details...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          Please sign in to view and manage your account settings.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="h-11 px-6 bg-[#3B3388] text-white font-semibold rounded-lg hover:bg-[#2F296D] transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-200">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-100 flex items-center justify-center">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
            </div>
            
            {/* Avatar upload loading overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            )}

            {/* Avatar Hover Actions */}
            {!uploading && (
              <div className="absolute -bottom-1 -right-1 flex gap-1">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="p-2 bg-[#3B3388] text-white rounded-full hover:bg-[#2F296D] transition-colors shadow-sm cursor-pointer"
                  title="Upload profile picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                {profile?.profileImage && (
                  <button
                    type="button"
                    onClick={handleAvatarDelete}
                    className="p-2 bg-red-650 bg-red-650 bg-red-700 text-white rounded-full hover:bg-red-800 transition-colors shadow-sm cursor-pointer"
                    title="Remove profile picture"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="text-center sm:text-left space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{name || "Your Profile"}</h1>
              {profile?.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 self-center">
                  <Check className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">
              Role: <span className="font-semibold capitalize">{profile?.role}</span> &middot; Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ""}
            </p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "border-[#3B3388] text-[#3B3388]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <User size={16} /> Personal Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "bookings"
                ? "border-[#3B3388] text-[#3B3388]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Ticket size={16} /> My Reservations
          </button>
        </div>

        {activeTab === "bookings" ? (
          <MyBookingsView />
        ) : (
          <>
            {/* Success/Error Banners */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-4 flex items-center gap-3">
                <Check className="w-5 h-5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Main Details Form */}
            <form onSubmit={handleProfileUpdate} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">Personal Details</h2>
                <p className="text-xs text-slate-400">Update your account username, phone, gender and basic information.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <span>Full Name</span>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 size-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 border border-slate-200 rounded-lg outline-none text-slate-700 bg-slate-50 focus:bg-white focus:border-[#3b338c] transition-colors font-normal text-sm"
                  placeholder="Full Name"
                />
              </div>
            </label>

            {/* Email (Read Only) */}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <span>Email Address</span>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 size-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  disabled
                  value={profile?.email || ""}
                  className="w-full h-11 pl-11 pr-4 border border-slate-200 rounded-lg outline-none text-slate-400 bg-slate-100 cursor-not-allowed font-normal text-sm"
                  placeholder="Email"
                />
              </div>
            </label>

            {/* Username */}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <span>Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none text-slate-700 bg-slate-50 focus:bg-white focus:border-[#3b338c] transition-colors font-normal text-sm"
                placeholder="username"
              />
            </label>

            {/* Phone */}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <span>Phone Number</span>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 size-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 border border-slate-200 rounded-lg outline-none text-slate-700 bg-slate-50 focus:bg-white focus:border-[#3b338c] transition-colors font-normal text-sm"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </label>

            {/* Date of Birth */}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <span>Date of Birth</span>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 size-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 border border-slate-200 rounded-lg outline-none text-slate-700 bg-slate-50 focus:bg-white focus:border-[#3b338c] transition-colors font-normal text-sm"
                />
              </div>
            </label>

            {/* Gender */}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <span>Gender</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none text-slate-700 bg-slate-50 focus:bg-white focus:border-[#3b338c] transition-colors font-normal text-sm"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Billing & Regional Preferences</h2>
            <p className="text-xs text-slate-400">Set your location details, language preference, and tax identifiers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Country */}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <span>Country</span>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3.5 size-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 border border-slate-200 rounded-lg outline-none text-slate-700 bg-slate-50 focus:bg-white focus:border-[#3b338c] transition-colors font-normal text-sm"
                  placeholder="United Kingdom"
                />
              </div>
            </label>

            {/* City / State */}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <span>City / State</span>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 size-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={cityState}
                  onChange={(e) => setCityState(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 border border-slate-200 rounded-lg outline-none text-slate-700 bg-slate-50 focus:bg-white focus:border-[#3b338c] transition-colors font-normal text-sm"
                  placeholder="London"
                />
              </div>
            </label>

            {/* Address / Road Area */}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <span>Address / Road Area</span>
              <input
                type="text"
                value={roadArea}
                onChange={(e) => setRoadArea(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none text-slate-700 bg-slate-50 focus:bg-white focus:border-[#3b338c] transition-colors font-normal text-sm"
                placeholder="Baker Street 221B"
              />
            </label>

            {/* Postal Code */}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <span>Postal Code</span>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none text-slate-700 bg-slate-50 focus:bg-white focus:border-[#3b338c] transition-colors font-normal text-sm"
                placeholder="NW1 6XE"
              />
            </label>

            {/* Language */}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <span>Preferred Language</span>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none text-slate-700 bg-slate-50 focus:bg-white focus:border-[#3b338c] transition-colors font-normal text-sm"
                placeholder="en"
              />
            </label>

            {/* Tax ID */}
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <span>Tax ID / NIF</span>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none text-slate-700 bg-slate-50 focus:bg-white focus:border-[#3b338c] transition-colors font-normal text-sm"
                placeholder="TAX-123456"
              />
            </label>
          </div>

          {/* Bio */}
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            <span>Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full p-4 border border-slate-200 rounded-lg outline-none text-slate-700 bg-slate-50 focus:bg-white focus:border-[#3b338c] transition-colors font-normal text-sm resize-none"
              placeholder="Tell us about yourself..."
            />
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.refresh()}
              className="h-11 px-5 border border-slate-200 bg-white text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Reset Changes
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-6 bg-[#3B3388] text-white font-semibold rounded-lg text-sm hover:bg-[#2F296D] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>

        {/* Danger Zone (Delete Account) */}
        <section className="bg-red-50/30 border border-red-200/50 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Danger Zone
            </h3>
            <p className="text-sm text-slate-500">
              Permanently delete your account, your profile metadata, and all associated bookings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="h-11 px-6 bg-red-700 text-white font-semibold rounded-lg text-sm hover:bg-red-800 transition-colors shrink-0 cursor-pointer"
          >
            Delete Account
          </button>
        </section>
        </>
        )}
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-150 flex items-center gap-3 text-red-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold">Confirm Account Deletion</h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                This action is irreversible. All of your bookings, personal profile settings, and login records will be deleted forever.
              </p>
              
              <label className="grid gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>Type <strong className="text-slate-800">DELETE MY ACCOUNT</strong> to confirm</span>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full h-11 px-3.5 border border-slate-200 rounded-lg outline-none bg-slate-50 text-slate-850 font-normal uppercase text-sm mt-1 focus:bg-white focus:border-red-600 transition-colors"
                  placeholder="DELETE MY ACCOUNT"
                />
              </label>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2.5 border border-slate-200 bg-white text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                  setError(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== "DELETE MY ACCOUNT" || deleting}
                className="px-4 py-2.5 bg-red-700 text-white font-semibold rounded-lg text-sm hover:bg-red-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                onClick={handleAccountDelete}
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
