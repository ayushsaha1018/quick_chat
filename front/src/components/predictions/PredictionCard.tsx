import React from "react";
import Link from "next/link";
import { Activity, Heart, Brain } from "lucide-react";

interface PredictionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export default function PredictionCard({ title, description, icon, href }: PredictionCardProps) {
  return (
    <Link href={href} className="block">
      <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
} 