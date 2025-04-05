"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";

export default function AiChatBox() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat(
    {}
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Set mounted state to enable animations
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-slate-200 dark:border-slate-700">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          AI Chat Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
            <Bot className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">How can I help you today?</p>
            <p className="text-sm">
              Ask me anything and I'll do my best to assist you.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={isMounted ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex mb-4 last:mb-0 gap-2",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "flex max-w-[80%] rounded-lg p-3",
                    message.role === "user"
                      ? "bg-indigo-500 text-white rounded-br-none"
                      : "bg-slate-100 dark:bg-slate-800 rounded-bl-none"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full shrink-0">
                      {message.role === "user" ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                    <div className="break-words">
                      {message.role === "user" ? (
                        message.content
                      ) : (
                        <Markdown>{message.content}</Markdown>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            name="prompt"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1"
            disabled={status === "streaming"}
          />
          <Button
            type="submit"
            disabled={status === "streaming" || !input.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 transition-colors"
          >
            {status === "streaming" ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
