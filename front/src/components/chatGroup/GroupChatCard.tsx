"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import GroupChatCardMenu from "./GroupChatCardMenu";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface GroupChatCardProps {
  group: GroupChatType;
  user: CustomUser;
  isCommunity?: boolean;
}

export default function GroupChatCard({
  group,
  user,
  isCommunity = false,
}: GroupChatCardProps) {
  const router = useRouter();

  const handleJoin = () => {
    router.push(`/chat/${group.id}`);
  };

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle className="text-2xl">{group.title}</CardTitle>
        {!isCommunity && <GroupChatCardMenu user={user} group={group} />}
      </CardHeader>
      <CardContent>
        <p>Created At: {new Date(group.created_at).toDateString()}</p>
        {isCommunity && (
          <Button 
            onClick={handleJoin}
            className="w-full mt-4"
          >
            Join Group
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
