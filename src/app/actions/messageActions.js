"use server";

import {
  sendMessage,
  getConversation,
  getConversations,
  markConversationAsRead,
  deleteMessage,
} from "../utils/supabase/crud";
import { revalidatePath } from "next/cache";

export async function sendMessageAction(recipientId, formData) {
  const content = formData.get("content");
  const userType = formData.get("userType");

  if (!content || !content.trim()) {
    return { success: false, message: "Message content is required." };
  }

  // High school students are always anonymous
  const isAnonymous = userType === "high_school";

  const { data, error } = await sendMessage(
    recipientId,
    content.trim(),
    isAnonymous,
  );

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/messages");
  revalidatePath(`/messages/${recipientId}`);
  return { success: true, data, message: "Message sent!" };
}

export async function getConversationAction(otherUserId) {
  const { data, error } = await getConversation(otherUserId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function getConversationsAction() {
  const { data, error } = await getConversations();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function markConversationAsReadAction(otherUserId) {
  const { data, error } = await markConversationAsRead(otherUserId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/messages");
  revalidatePath(`/messages/${otherUserId}`);
  return { success: true, data };
}

export async function deleteMessageAction(messageId) {
  const { data, error } = await deleteMessage(messageId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/messages");
  return { success: true, data, message: "Message deleted!" };
}
