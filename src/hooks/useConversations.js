import { useState, useEffect, useCallback } from "react";
import { clientService } from "../services/api";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { API_URL } from "../config/api.config";

/**
 * Custom hook for managing client conversations
 * Handles socket.io connections and conversation data
 */
const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  // Initialize socket connection
  useEffect(() => {
    // Get token from storage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    // Connect to socket server with auth token
    const socketInstance = io(API_URL.replace("/api", ""), {
      auth: { token },
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
  }, []);

  // Handle receiving messages
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      // Check if this is a message we added optimistically
      setMessages((prev) => {
        // Look for an optimistic message with the same content and conversation
        const optimisticMessage = prev.find(
          (m) =>
            m._optimistic &&
            m.content === message.content &&
            m.conversationId === message.conversationId
        );

        if (optimisticMessage) {
          // Replace the optimistic message with the real one
          return prev.map((m) => (m.id === optimisticMessage.id ? message : m));
        } else {
          // If no matching optimistic message, append the new one
          return [...prev, message];
        }
      });

      // Mark messages as read if they're for the current conversation
      if (
        message.conversationId === currentConversation?.id &&
        message.toUserId === socket.id
      ) {
        socket.emit("markAsRead", { messageId: message.id });
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, currentConversation]);

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await clientService.getConversations();
      setConversations(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(err.message || "Failed to load conversations");
      toast.error("Could not load conversations. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Start a new conversation with a vendor
  const startConversation = useCallback(
    async (vendorId) => {
      setLoading(true);
      try {
        const response = await clientService.startConversation({ vendorId });
        const newConversation = response.data;

        // Add new conversation to state
        setConversations((prev) => [newConversation, ...prev]);

        // Set as current conversation
        setCurrentConversation(newConversation);

        // Join the conversation room
        if (socket) {
          socket.emit("joinConversation", newConversation.id);
        }

        return newConversation;
      } catch (err) {
        console.error("Error starting conversation:", err);
        toast.error("Failed to start conversation. Please try again.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [socket]
  );

  // Select a conversation to view
  const selectConversation = useCallback(
    (conversation) => {
      setCurrentConversation(conversation);

      // Join the conversation room
      if (socket && conversation) {
        socket.emit("joinConversation", conversation.id);

        // Set messages from conversation history
        if (conversation.messages) {
          setMessages(conversation.messages);
        }
      }
    },
    [socket]
  );

  // Send a message in the current conversation
  const sendMessage = useCallback(
    (content, toUserId) => {
      if (!socket || !currentConversation) return;

      // Emit message through socket
      socket.emit("sendMessage", {
        conversationId: currentConversation.id,
        content,
        toUserId,
      });

      // Optimistically add to messages state
      const optimisticMessage = {
        id: Date.now().toString(),
        content,
        fromUserId: socket.id,
        toUserId,
        conversationId: currentConversation.id,
        createdAt: new Date().toISOString(),
        read: false,
        _optimistic: true, // Flag to identify optimistic updates
      };

      setMessages((prev) => [...prev, optimisticMessage]);
    },
    [socket, currentConversation]
  );

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

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
  };
};

export default useConversations;
