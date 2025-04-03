import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "@/lib/socket.config";
import { Input } from "../ui/input";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/app/api/auth/[...nextauth]/options";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { format } from "date-fns";

export default function Chats({
  group,
  oldMessages,
  chatUser,
}: {
  group: GroupChatType;
  oldMessages: Array<MessageType> | [];
  chatUser?: GroupChatUserType;
}) {
  const { data: session } = useSession() as { data: CustomSession | null };
  const params = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<MessageType>>(oldMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  let socket = useMemo(() => {
    const socket = getSocket();
    socket.auth = {
      room: group.id,
    };
    return socket.connect();
  }, []);
  
  useEffect(() => {
    socket.on("message", (data: MessageType) => {
      console.log("The message is", data);
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();
    });

    return () => {
      socket.close();
    };
  }, []);
  
  // Format date for display
  const formatMessageTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'h:mm a');
    } catch (e) {
      return '';
    }
  };
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Skip empty messages
    if (!message.trim()) return;

    // Get user name - try multiple sources to ensure we have a name
    let userName = "Anonymous User";
    
    // First try chatUser from props
    if (chatUser?.name) {
      userName = chatUser.name;
    } 
    // Then try local storage
    else {
      const storedData = localStorage.getItem(params.id as string);
      if (storedData) {
        try {
          const userData = JSON.parse(storedData);
          if (userData?.name) {
            userName = userData.name;
          }
        } catch (e) {
          console.error("Error parsing user data from localStorage", e);
        }
      }
    }
    
    // Fallback to session user name
    if (userName === "Anonymous User" && session?.user?.name) {
      userName = session.user.name;
    }

    const payload: MessageType = {
      id: uuidv4(),
      message: message,
      name: userName,
      created_at: new Date().toISOString(),
      group_id: group.id,
    };
    
    console.log("Sending message with name:", userName);
    socket.emit("message", payload);
    setMessage("");
    setMessages([...messages, payload]);
    scrollToBottom();
  };

  const isCurrentUser = (msgName: string) => {
    return msgName === chatUser?.name || 
           (session?.user?.name === msgName && !chatUser?.name);
  };

  return (
    <div className="flex flex-col h-[94vh] p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="flex flex-col gap-3">
          {messages.map((msg) => {
            const isMine = isCurrentUser(msg.name);
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[85%] ${isMine ? 'self-end' : 'self-start'}`}
              >
                {/* Sender name - only show for others' messages or if it's the first of a sequence */}
                {!isMine && <span className="text-xs font-medium text-gray-700 ml-2 mb-1">{msg.name}</span>}
                
                <div className={`rounded-lg px-4 py-2 shadow-sm ${
                  isMine 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                }`}>
                  <div className="break-words">
                    {msg.message}
                  </div>
                  <div className={`text-xs mt-1 ${isMine ? 'text-blue-100' : 'text-gray-500'} text-right`}>
                    {formatMessageTime(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white rounded-full border border-gray-300 pl-4 pr-1 py-1 shadow-sm">
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          className="border-0 focus-visible:ring-0 flex-1 bg-transparent"
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button 
          type="submit" 
          size="icon"
          className="rounded-full h-10 w-10 bg-blue-500 hover:bg-blue-600"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
