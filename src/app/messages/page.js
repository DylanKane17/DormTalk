"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "../components/Card";
import Alert from "../components/Alert";
import { getConversationsAction } from "../actions/messageActions";

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    const result = await getConversationsAction();
    if (result.success) {
      setConversations(result.data || []);
    } else {
      setAlert({ type: "error", message: result.message });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 mt-2">Your conversations</p>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {conversations.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-gray-400 text-lg mb-2">No messages yet</p>
              <p className="text-gray-500 text-sm">
                Start a conversation by visiting someone's profile and clicking
                "Message"
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Link
                key={conversation.partnerId}
                href={`/messages/${conversation.partnerId}`}
              >
                <Card className="hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          @{conversation.partner.username}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-cyan-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm truncate">
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-gray-500">
                        {new Date(
                          conversation.lastMessage.created_at,
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(
                          conversation.lastMessage.created_at,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
