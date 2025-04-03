"use client";
import React from "react";
import ProfileMenu from "../auth/ProfileMenu";

export default function DashNav({
  image,
  name,
}: {
  image?: string;
  name: string;
}) {
  return (
    <nav className="w-full py-4 px-8 flex justify-between items-center bg-white shadow-md">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">QuickChat</h1>
      <div className="flex items-center space-x-4 md:space-x-8 text-gray-700">
        <ProfileMenu name={name} image={image} />
      </div>
    </nav>
  );
}
