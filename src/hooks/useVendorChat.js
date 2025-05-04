import { useState, useEffect, useCallback } from "react";
import { vendorService } from "../services/api";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { API_URL } from "../config/api.config";

/**
 * Custom hook for managing vendor conversations
 * Handles socket.io connections and conversation data
 */
const useVendorChat = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  // Get user from storage
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    // Get token from storage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token || !user) return;

    // Connect to socket server with auth token
    const socketInstance = io(API_URL.replace("/api", ""), {
      auth: { token },
      query: { role: "VENDOR" },
    });

    // Socket event handlers
    socketInstance.on("connect", () => {
      console.log("Socket connected");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      toast.error("Chat connection error: " + err.message);
    });

    // Save socket instance
    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user]);

  // Handle receiving messages
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      // Add the new message
      setMessages((prev) => [...prev, message]);

      // Update unread count in conversations list
      if (message.conversationId !== currentConversation?.id) {
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === message.conversationId
              ? { ...conv, unreadCount: (conv.unreadCount || 0) + 1 }
              : conv
          )
        );
      }

      // Refresh conversations to get the updated list with the new message
      fetchConversations();
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, currentConversation]);

  // Get total unread message count across all conversations
  const getTotalUnreadCount = useCallback(() => {
    return conversations.reduce(
      (total, conv) => total + (conv.unreadCount || 0),
      0
    );
  }, [conversations]);

  // Fetch all conversations for the vendor
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await vendorService.getConversations();

      // Process conversations to find the client in each conversation
      const processedConversations = response.data.map((conv) => {
        // Find the participant who is not the current user (the client)
        const client = conv.participants.find((p) => p.id !== user?.id);
        return {
          ...conv,
          client,
          unreadCount:
            conv.messages?.filter((m) => !m.read && m.senderId !== user?.id)
              .length || 0,
        };
      });

      setConversations(processedConversations);

      // If we have a current conversation, update its messages
      if (currentConversation) {
        const updatedConversation = processedConversations.find(
          (conv) => conv.id === currentConversation.id
        );
        if (updatedConversation) {
          setCurrentConversation(updatedConversation);
          setMessages(updatedConversation.messages || []);
        }
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(err.message || "Failed to load conversations");
      toast.error("Could not load conversations. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user, currentConversation]);

  // Start a new conversation with a client
  const startConversation = useCallback(
    async (clientId) => {
      setLoading(true);
      try {
        // Check if conversation already exists
        const existing = conversations.find(
          (conv) => conv.client && conv.client.userId === clientId
        );

        if (existing) {
          selectConversation(existing);
          return existing;
        }

        // Create new conversation
        const response = await vendorService.startConversation(clientId);

        // Process to add client info
        const newConversation = {
          ...response.data,
          client: response.data.participants.find((p) => p.id !== user?.id),
          unreadCount: 0,
          messages: [],
        };

        // Add new conversation to state
        setConversations((prev) => [newConversation, ...prev]);

        // Set as current conversation
        selectConversation(newConversation);

        // Join the conversation room
        if (socket) {
          socket.emit("joinConversation", newConversation.id);
        }

        return newConversation;
      } catch (err) {
        console.error("Error starting conversation:", err);
        toast.error("Failed to start conversation. Please try again.");
        setError("Failed to start conversation. Please try again.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [conversations, socket, user]
  );

  // Select a conversation to view
  const selectConversation = useCallback(
    (conversation) => {
      // If an ID is passed instead of a conversation object
      if (conversation && conversation.id && !conversation.participants) {
        const fullConversation = conversations.find(
          (c) => c.id === conversation.id
        );
        if (fullConversation) {
          setCurrentConversation(fullConversation);
          setMessages(fullConversation.messages || []);

          // Join the conversation room
          if (socket) {
            socket.emit("joinConversation", fullConversation.id);
          }

          // Mark messages as read (simulated since we don't have the endpoint)
          if (fullConversation.unreadCount > 0) {
            // Update the conversation to mark messages as read locally
            setConversations((prevConversations) =>
              prevConversations.map((conv) =>
                conv.id === fullConversation.id
                  ? { ...conv, unreadCount: 0 }
                  : conv
              )
            );
          }
        } else {
          console.error("Conversation not found:", conversation.id);
        }
      } else if (conversation) {
        setCurrentConversation(conversation);
        setMessages(conversation.messages || []);

        // Join the conversation room
        if (socket && conversation.id) {
          socket.emit("joinConversation", conversation.id);
        }

        // Mark messages as read (simulated since we don't have the endpoint)
        if (conversation.unreadCount > 0) {
          // Update the conversation to mark messages as read locally
          setConversations((prevConversations) =>
            prevConversations.map((conv) =>
              conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
            )
          );
        }
      } else {
        setCurrentConversation(null);
        setMessages([]);
      }
    },
    [socket, conversations]
  );

  // Send a message in the current conversation
  const sendMessage = useCallback(
    (content) => {
      if (!socket || !currentConversation || !currentConversation.client)
        return;

      // Get client ID to send to
      const clientId = currentConversation.client.userId;

      // Create optimistic message
      const optimisticMessage = {
        id: Date.now().toString(),
        content,
        senderId: user?.id,
        recipientId: clientId,
        conversationId: currentConversation.id,
        createdAt: new Date().toISOString(),
        read: false,
        _optimistic: true, // Flag to identify optimistic updates
      };

      // Add to messages immediately for responsive UI
      setMessages((prev) => [...prev, optimisticMessage]);

      // Emit message through socket
      socket.emit("sendMessage", {
        conversationId: currentConversation.id,
        content,
        toUserId: clientId,
      });

      // Refresh conversations after a small delay to get the updated message
      setTimeout(() => {
        fetchConversations();
      }, 1000);
    },
    [socket, currentConversation, user, fetchConversations]
  );

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [fetchConversations, user]);

  return {
    conversations,
    loading,
    error,
    currentConversation,
    messages,
    fetchConversations,
    startConversation,
    selectConversation,
    sendMessage,
    getTotalUnreadCount,
  };
};

export default useVendorChat;
