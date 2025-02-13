// app/components/LogoutButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/sign-in");
  }

  return <button onClick={handleLogout}>Logout</button>;
}