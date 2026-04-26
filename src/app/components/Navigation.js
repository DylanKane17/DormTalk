"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUserProfileAction } from "../actions/profileActions";

export default function Navigation() {
  const pathname = usePathname();
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserId = async () => {
      const result = await getCurrentUserProfileAction();
      if (result.success && result.data) {
        setUserId(result.data.id);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    getUserId();
  }, []);

  // Define navigation items with authentication requirements
  const allNavItems = [
    { href: "/", label: "Home", requiresAuth: false, hideWhenAuth: false },
    {
      href: "/posts",
      label: "Posts",
      requiresAuth: false,
      hideWhenAuth: false,
    },
    {
      href: "/search",
      label: "Search",
      requiresAuth: false,
      hideWhenAuth: false,
    },
    {
      href: "/auth",
      label: "Sign In",
      requiresAuth: false,
      hideWhenAuth: true,
    },
    {
      href: userId ? `/profile/${userId}` : "/profile/edit",
      label: "Profile",
      requiresAuth: true,
      hideWhenAuth: false,
    },
    {
      href: "/messages",
      label: "Messages",
      requiresAuth: true,
      hideWhenAuth: false,
    },
    {
      href: "/my-posts",
      label: "My Posts",
      requiresAuth: true,
      hideWhenAuth: false,
    },
    {
      href: "/my-comments",
      label: "My Comments",
      requiresAuth: true,
      hideWhenAuth: false,
    },
    {
      href: "/moderation",
      label: "Moderation",
      requiresAuth: true,
      hideWhenAuth: false,
    },
  ];

  // Filter navigation items based on authentication status
  const navItems = allNavItems.filter((item) => {
    if (item.requiresAuth && !isAuthenticated) return false;
    if (item.hideWhenAuth && isAuthenticated) return false;
    return true;
  });

  return (
    <nav className="bg-gray-900 shadow-md shadow-cyan-900/20 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            <Link href="/" className="text-xl font-bold text-cyan-400">
              DormTalk
            </Link>
          </div>
          <div className="flex gap-1">
            {loading ? (
              <div className="px-4 py-2 text-gray-500">Loading...</div>
            ) : (
              navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-cyan-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
