import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import ServiceLayout from "@/components/layouts/ServiceLayout";
import GroupChatCard from "@/components/chatGroup/GroupChatCard";
import { fetchAllPublicGroups } from "@/fetch/groupFetch";

export default async function CommunitiesPage() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const groups = await fetchAllPublicGroups();

  return (
    <ServiceLayout session={session}>
      <div>
        <h1 className="text-2xl font-bold mb-6">Communities</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.length > 0 ? (
            groups.map((group) => (
              <GroupChatCard
                key={group.id}
                group={group}
                user={session?.user!}
                isCommunity={true}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No communities available at the moment.
            </div>
          )}
        </div>
      </div>
    </ServiceLayout>
  );
} 