"use client";

import ChatBase from "@/components/chat/ChatBase";
import { fetchChats } from "@/fetch/chatsFetch";
import { fetchChatGroup, fetchChatGroupUsers } from "@/fetch/groupFetch";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CHAT_GROUP_USERS } from "@/lib/apiAuthRoutes";

export default function Chat({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [chatGroup, setChatGroup] = useState<GroupChatType | null>(null);
  const [chatGroupUsers, setChatGroupUsers] = useState<
    Array<GroupChatUserType>
  >([]);
  const [chats, setChats] = useState<Array<MessageType>>([]);

  useEffect(() => {
    const joinGroup = async () => {
      try {
        if (!session?.user?.id) {
          toast({
            title: "Error",
            description: "Please sign in to join the group",
            variant: "destructive",
          });
          router.push("/");
          return;
        }

        // First try to join the group
        const joinResponse = await fetch(`${CHAT_GROUP_USERS}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session.user.token}`,
          },
          body: JSON.stringify({
            groupId: params.id,
            userId: session.user.id,
            name: session.user.name || "Anonymous User",
          }),
        });

        if (!joinResponse.ok) {
          const error = await joinResponse.json();
          if (error.message === "User is already a member of this group") {
            // This is fine, user is already a member
          } else {
            throw new Error(error.message || "Failed to join group");
          }
        }

        // Fetch group data
        const group = await fetchChatGroup(params.id, session.user.token);
        if (!group) {
          throw new Error("Group not found");
        }

        // Fetch users and chats
        const users = await fetchChatGroupUsers(params.id, session.user.token);
        const messages = await fetchChats(params.id, session.user.token);

        setChatGroup(group);
        setChatGroupUsers(users);
        setChats(messages);
      } catch (error) {
        console.error("Error joining group:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to join group",
          variant: "destructive",
        });
        router.push("/communities");
      } finally {
        setLoading(false);
      }
    };

    joinGroup();
  }, [params.id, session?.user?.id, router, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!chatGroup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
          <p className="text-gray-600">
            Please wait while we set up your chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ChatBase group={chatGroup} users={chatGroupUsers} oldMessages={chats} />
    </div>
  );
}
