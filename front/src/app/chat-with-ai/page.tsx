import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import ServiceLayout from "@/components/layouts/ServiceLayout";

export default async function ChatWithAIPage() {
  const session: CustomSession | null = await getServerSession(authOptions);

  return (
    <ServiceLayout session={session}>
      <div>
        <h1 className="text-2xl font-bold mb-6">Chat with AI</h1>
        <div className="max-w-4xl mx-auto">
          <div className="border rounded-lg p-6 bg-background">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  AI
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground">Hello! I'm your AI assistant. How can I help you today?</p>
                </div>
              </div>
              {/* Chat input will go here */}
              <div className="border-t pt-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-md"
                  />
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
} 