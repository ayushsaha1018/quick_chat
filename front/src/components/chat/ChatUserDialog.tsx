"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { CHAT_GROUP_USERS } from "@/lib/apiAuthRoutes";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/app/api/auth/[...nextauth]/options";

export default function ChatUserDialog({
  open,
  setOpen,
  group,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  group: GroupChatType;
}) {
  const { data: session } = useSession() as { data: CustomSession | null };
  const params = useParams();
  const searchParams = useSearchParams();
  const isCommunity = searchParams.get("from") === "communities";
  const [state, setState] = useState({
    name: "",
    passcode: "",
  });

  useEffect(() => {
    const data = localStorage.getItem(params["id"] as string);
    if (data) {
      const jsonData = JSON.parse(data);
      if (jsonData?.name && jsonData?.group_id) {
        setOpen(false);
      }
    }
    
    // If coming from communities page, close the dialog automatically
    if (isCommunity && session?.user) {
      setOpen(false);
    }
  }, [isCommunity, params, session, setOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const localData = localStorage.getItem(params["id"] as string);
    if (!localData) {
      const token = session?.user?.token || "";
      
      try {
        const { data } = await axios.post(
          CHAT_GROUP_USERS,
          {
            name: state.name || session?.user?.name || "Anonymous User",
            groupId: params["id"] as string,
            userId: session?.user?.id || "0",
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        localStorage.setItem(
          params["id"] as string,
          JSON.stringify(data?.data)
        );
      } catch (error) {
        toast.error("Something went wrong.please try again!");
        return;
      }
    }
    
    // Skip passcode check if coming from communities page
    if (isCommunity) {
      setOpen(false);
      return;
    }
    
    // Only verify passcode for non-community chats
    if (group.passcode && group.passcode !== state.passcode) {
      toast.error("Please enter correct passcode!");
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Name and Passcode</DialogTitle>
          <DialogDescription>
            Add your name and passcode to join in room
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <Input
              placeholder="Enter your name"
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
            />
          </div>
          {!isCommunity && (
            <div className="mt-2">
              <Input
                placeholder="Enter your passcode"
                value={state.passcode}
                onChange={(e) => setState({ ...state, passcode: e.target.value })}
              />
            </div>
          )}
          <div className="mt-2">
            <Button className="w-full">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

