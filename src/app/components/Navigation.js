"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/auth", label: "Auth" },
    { href: "/posts", label: "Posts" },
    { href: "/my-posts", label: "My Posts" },
    { href: "/my-comments", label: "My Comments" },
  ];

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
            {navItems.map((item) => (
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
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
