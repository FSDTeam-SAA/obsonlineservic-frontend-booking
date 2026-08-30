"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { BrandLockup } from "@/components/brand-mark";
import { primaryNavigation } from "../_data/site-data";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { getMyProfile } from "@/features/profile/api/profile.api";

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="8.25" />
    <path d="M3.75 12h16.5M12 3.75c2.1 2.25 3.15 5 3.15 8.25S14.1 18 12 20.25C9.9 18 8.85 14.75 8.85 12S9.9 6 12 3.75Z" />
  </svg>
);

export function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);

  // Fetch /api/v1/user/me to get profileImage
  useEffect(() => {
    let isMounted = true;
    if (session) {
      getMyProfile()
        .then((res) => {
          if (isMounted && res?.data?.profileImage) {
            setUserProfileImage(res.data.profileImage);
          }
        })
        .catch((err) => {
          console.error("Failed to load profile image for navbar:", err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [session]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayAvatar = userProfileImage || session?.user?.image;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="flex h-16 container items-center justify-between gap-5 px-5 sm:px-8">
        <Link href="/" className="shrink-0 text-[#2e286f] transition-transform duration-300 hover:scale-[1.03]" aria-label="Booking is Yours home">
          <BrandLockup className="flex items-center gap-1.5" />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {primaryNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-[16px] font-medium text-slate-700 transition-colors hover:text-[#30277a]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Authentication Section */}
          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 border border-slate-200 hover:border-slate-300  rounded-full text-xs font-semibold text-slate-750 bg-white transition-colors cursor-pointer select-none shadow-2xs"
              >
                <div className="size-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border-2 border-[#7270b3] shrink-0">
                  {displayAvatar ? (
                    <img src={displayAvatar} alt={session.user?.name || "User"} className="size-full object-cover" />
                  ) : (
                    <User className="size-3 text-slate-500" />
                  )}
                </div>
                {/* <span className="max-w-[90px] truncate">{session.user?.name || "My Account"}</span> */}
                {/* <ChevronDown className={`size-3 transition-transform duration-200 text-slate-400 ${dropdownOpen ? "rotate-180" : ""}`} /> */}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1.5 duration-150 z-50">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center gap-2.5">
                    <div className="size-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shrink-0">
                      {displayAvatar ? (
                        <img src={displayAvatar} alt={session.user?.name || "User"} className="size-full object-cover" />
                      ) : (
                        <User className="size-4 text-slate-500" />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-[11px] font-bold text-slate-800 truncate">{session.user?.name}</p>
                      <p className="text-[9px] text-slate-400 truncate">{session.user?.email}</p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors mt-1"
                  >
                    <Settings className="size-3.5 text-slate-400" />
                    Profile Settings
                  </Link>

                  {session.user?.role === "admin" && (
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="size-3.5 text-slate-400" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50/60 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-3.5 text-red-500" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden border border-[#30277a] px-4 py-2 text-xs font-semibold text-[#30277a] transition-colors hover:bg-[#30277a] hover:text-white sm:block rounded-lg"
            >
              Login/Register
            </Link>
          )}

          <Link href="/#booking" className="bg-[#30277a] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#21195b] rounded-lg">
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
