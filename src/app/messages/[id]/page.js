"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import {
  getConversationAction,
  sendMessageAction,
  markConversationAsReadAction,
} from "../../actions/messageActions";
import {
  getProfileByIdAction,
  getCurrentUserProfileAction,
} from "../../actions/profileActions";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversation = async () => {
    const result = await getConversationAction(params.id);
    if (result.success) {
      setMessages(result.data || []);
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    const [otherUserResult, currentUserResult] = await Promise.all([
      getProfileByIdAction(params.id),
      getCurrentUserProfileAction(),
    ]);

    if (otherUserResult.success) {
      setOtherUser(otherUserResult.data);
    }
    if (currentUserResult.success) {
      setCurrentUser(currentUserResult.data);
    }
  };

  useEffect(() => {
    loadConversation();
    loadUsers();

    // Mark messages as read
    markConversationAsReadAction(params.id);

    // Auto-refresh every 3 seconds
    const interval = setInterval(() => {
      loadConversation();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    setSending(true);
    const formData = new FormData();
    formData.append("content", messageContent);
    formData.append("isAnonymous", isAnonymous.toString());

    const result = await sendMessageAction(params.id, formData);
    if (result.success) {
      setMessageContent("");
      setIsAnonymous(false);
      loadConversation();
    } else {
      setAlert({ type: "error", message: result.message });
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex items-center gap-4">
          <Button variant="secondary" onClick={() => router.push("/messages")}>
            ← Back
          </Button>
          {otherUser && (
            <div className="flex-1">
              <Link href={`/profile/${otherUser.id}`}>
                <h1 className="text-2xl font-bold text-white hover:text-cyan-400 transition-colors">
                  @{otherUser.username}
                </h1>
              </Link>
              {otherUser.school && (
                <p className="text-sm text-gray-400">{otherUser.school}</p>
              )}
            </div>
          )}
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Messages Container */}
        <Card className="mb-4 p-0 overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage =
                  currentUser && message.sender_id === currentUser.id;
                const showAnonymous = message.is_anonymous && !isOwnMessage;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        isOwnMessage
                          ? "bg-cyan-600 text-white"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      {showAnonymous && (
                        <p className="text-xs text-gray-400 italic mb-1">
                          Anonymous
                        </p>
                      )}
                      <p className="break-words">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? "text-cyan-200" : "text-gray-400"
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {isOwnMessage && message.is_anonymous && (
                          <span className="ml-2 italic">
                            (sent anonymously)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Message Input */}
        <Card>
          <form onSubmit={handleSendMessage} className="space-y-3">
            {/* Anonymous toggle - only for high school students */}
            {currentUser?.user_type === "high_school" && (
              <div className="flex items-center space-x-2 p-2 bg-gray-800 rounded-lg border border-gray-700">
                <input
                  type="checkbox"
                  id="isAnonymousMessage"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isAnonymousMessage"
                  className="text-xs text-gray-300 cursor-pointer"
                >
                  Send anonymously (hide my username)
                </label>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={sending}
              />
              <Button
                type="submit"
                disabled={sending || !messageContent.trim()}
              >
                {sending ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
