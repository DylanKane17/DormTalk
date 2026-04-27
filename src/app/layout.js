import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { ThemeProvider } from "./context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DormTalk - Campus Community",
  description: "Connect with your campus community",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var storageKey = "theme-preference";
                var legacyStorageKey = "theme";
                var storedPreference = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey);
                var preference = storedPreference === "light" || storedPreference === "dark" || storedPreference === "system"
                  ? storedPreference
                  : "system";
                var resolvedTheme = preference;
                if (preference === "system") {
                  resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                }
                document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
                document.documentElement.setAttribute("data-theme", resolvedTheme);
                document.documentElement.style.colorScheme = resolvedTheme;
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-500">
        <ThemeProvider>
          <Navigation />
          <main className="pt-20 flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
