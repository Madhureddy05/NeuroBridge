"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Send, Bot, User, Smile, Paperclip, Mic } from 'lucide-react'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your wellness assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

const userId = "demo_user_123";

const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = {
    role: "user",
    content: input,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  try {
    const res = await fetch("http://localhost:5000/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        message: input,
      }),
    });

    const data = await res.json();

    const assistantMessage = {
      role: "assistant",
      content: data.response || "Sorry, something went wrong.",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
  } catch (error) {
    console.error("Error fetching response:", error);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Sorry, I couldn't connect to the assistant. Please try again later.",
        timestamp: new Date(),
      },
    ]);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">Chat with our AI assistant about your wellbeing, get support, or just talk about your day.</p>
      </div>

      <Card className="h-[calc(100vh-250px)]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI Assistant" />
              <AvatarFallback><Bot /></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Wellness Assistant</CardTitle>
              <CardDescription>AI-powered support for your wellbeing</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[calc(100vh-400px)] pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}</AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg px-4 py-2 ${message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
                      <p>{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex w-full items-center gap-2">
          <Button variant="outline" size="icon"><Paperclip className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><Mic className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><Smile className="h-4 w-4" /></Button>
          <Input placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="flex-1" />
          <Button size="icon" onClick={handleSend} disabled={!input.trim()}><Send className="h-4 w-4" /></Button>
        </CardFooter>
      </Card>
    </div>
  )
}
