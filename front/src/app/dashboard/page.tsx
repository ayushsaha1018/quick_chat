import CreateChat from "@/components/chatGroup/CreateChat";
import DashNav from "@/components/chatGroup/DashNav";
import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { fetchChatGroups } from "@/fetch/groupFetch";
import GroupChatCard from "@/components/chatGroup/GroupChatCard";
import Link from "next/link";
import { Users, MessageSquare, Activity } from "lucide-react";

export default async function dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const groups: Array<GroupChatType> | [] = await fetchChatGroups(
    session?.user?.token!
  );
  return (
    <div>
      {/* Full width navbar */}
      <DashNav
        name={session?.user?.name!}
        image={session?.user?.image ?? undefined}
      />
      
      {/* Content area with 20/80 split */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - 20% width */}
        <div className="w-1/5 bg-gray-100 p-6 border-r">
          <div className="space-y-6">
            {/* Communities Link */}
            <Link 
              href="/communities" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Communities</span>
            </Link>

            {/* Chat with AI Link */}
            <Link 
              href="/chat-with-ai" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Chat with AI</span>
            </Link>

            {/* Predict Disease Link */}
            <Link 
              href="/predict-disease" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Activity className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Predict Disease</span>
            </Link>
          </div>
        </div>

        {/* Right Content - 80% width */}
        <div className="w-4/5 p-6 overflow-y-auto">
          <div className="text-end mb-6">
            <CreateChat user={session?.user!} />
          </div>

          {/* If Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.length > 0 &&
              groups.map((item, index) => (
                <GroupChatCard group={item} key={index} user={session?.user!} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
