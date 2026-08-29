import React, { Suspense } from "react";
import { ProfilePage } from "@/features/profile/components/ProfilePage";
import { ProfileSkeleton } from "@/features/profile/components/ProfileSkeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Booking is Yours",
  description: "View and manage your account details, billing preferences, and profile settings.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto py-10">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfilePage />
        </Suspense>
      </div>
    </main>
  );
}
