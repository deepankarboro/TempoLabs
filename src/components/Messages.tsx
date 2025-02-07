import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string;
  };
}

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    if (user && selectedUser) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select(
            `
            *,
            sender:profiles!sender_id(*)
          `,
          )
          .or(
            `and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser}),and(sender_id.eq.${selectedUser},receiver_id.eq.${user.id})`,
          )
          .order("created_at", { ascending: true });

        if (error) console.error("Error fetching messages:", error);
        else setMessages(data || []);
      };

      fetchMessages();

      // Subscribe to new messages
      const subscription = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `sender_id=eq.${user.id},receiver_id=eq.${selectedUser}`,
          },
          fetchMessages,
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, selectedUser]);

  const sendMessage = async () => {
    if (!user || !selectedUser || !newMessage.trim()) return;

    const { error } = await supabase.from("messages").insert({
      content: newMessage,
      sender_id: user.id,
      receiver_id: selectedUser,
    });

    if (error) console.error("Error sending message:", error);
    else setNewMessage("");
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
              >
                {message.sender_id !== user?.id && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender?.avatar_url} />
                    <AvatarFallback>
                      {message.sender?.username?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-2 rounded-lg max-w-[70%] ${message.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2 mt-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
