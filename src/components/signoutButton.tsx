"use client";
import { useDisconnect } from "wagmi";
import { signOut } from "next-auth/react";
import React from "react";
import { useRouter } from "next/router";

const SignoutButton = () => {
  const router = useRouter();
  const requestNo = (router.query.slug && router.query.slug[0]) || "";

  const { disconnectAsync } = useDisconnect();
  const handleSignout = async () => {
    disconnectAsync();
    signOut({ callbackUrl: `/${requestNo}` });
  };
  return (
    <div className="flex items-center gap-2">
      <p className="text-gray-400">
        You have been signed in{" "}
        <span className="font-semibold text-green-400 text-xl">
          successfully
        </span>
        !
      </p>
      <button
        className="py-2 px-4 bg-blue-900 border border-blue-900 hover:bg-transparent active:scale-95"
        onClick={handleSignout}
      >
        Sign out
      </button>
    </div>
  );
};

export default SignoutButton;
