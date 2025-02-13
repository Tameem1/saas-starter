// app/(chatbots)/layout.tsx
"use client";

import "../styles/custom.css";
import { use } from "react";
import Link from "next/link";
import { useUser } from "@/lib/auth";
import { signOut } from "@/app/(login)/actions";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatbotsLayout({ children }: { children: React.ReactNode }) {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <section className="flex flex-col min-h-screen">
      {/* Example top navbar (reuse or adapt from (dashboard)/layout) */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            Chatbots
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer size-9">
                    <AvatarImage alt={user.name || ""} />
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="flex flex-col gap-1">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex w-full items-center">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <form action={handleSignOut} className="w-full">
                    <button type="submit" className="flex w-full">
                      <DropdownMenuItem className="w-full flex-1 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main page content */}
      <main className="max-w-7xl mx-auto w-full p-4">{children}</main>
    </section>
  );
}