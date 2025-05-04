import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { format } from "date-fns";
import useConversations from "../../../../hooks/useConversations";
import { clientService } from "../../../../services/api";

const MessageBubble = ({ message, isOwnMessage }) => {
  const formattedTime = message.createdAt
    ? format(new Date(message.createdAt), "h:mm a")
    : "";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: "70%",
          borderRadius: 2,
          p: 2,
          bgcolor: isOwnMessage ? "primary.main" : "grey.200",
          color: isOwnMessage ? "white" : "text.primary",
          position: "relative",
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "right",
            mt: 0.5,
            opacity: 0.8,
          }}
        >
          {formattedTime}
        </Typography>
      </Box>
    </Box>
  );
};

const ConversationList = ({ conversations, currentId, onSelect, loading }) => {
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (conversations.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">No conversations yet</Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {conversations.map((conversation) => {
        // Find the other participant (vendor)
        const vendor = conversation.participants.find(
          (p) => p.role === "VENDOR"
        );

        // Count unread messages
        const unreadCount =
          conversation.messages?.filter(
            (m) => !m.read && m.toUserId === conversation.id // Fix this if necessary
          ).length || 0;

        return (
          <ListItem
            key={conversation.id}
            component="div"
            onClick={() => onSelect(conversation)}
            sx={{
              bgcolor:
                conversation.id === currentId ? "action.selected" : "inherit",
              borderRadius: 1,
              mb: 0.5,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemAvatar>
              <Badge
                color="error"
                badgeContent={unreadCount}
                invisible={unreadCount === 0}
              >
                <Avatar>
                  {vendor?.businessName?.charAt(0) || <PersonIcon />}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={vendor?.businessName || "Vendor"}
              secondary={
                conversation.messages?.length > 0
                  ? conversation.messages[conversation.messages.length - 1]
                      .content
                  : "No messages yet"
              }
              primaryTypographyProps={{
                fontWeight: unreadCount > 0 ? "bold" : "normal",
              }}
              secondaryTypographyProps={{
                noWrap: true,
                fontWeight: unreadCount > 0 ? "bold" : "normal",
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

// Vendor Selection Dialog component
const NewConversationDialog = ({ open, onClose, onSelect }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch vendors when dialog opens
  useEffect(() => {
    if (open) {
      fetchVendors();
    }
  }, [open]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      // Fetch vendors from the API - this endpoint will need to be implemented
      const response = await clientService.getServices();

      // Create a map to deduplicate vendors
      const vendorMap = new Map();
      response.data.services.forEach((service) => {
        if (service.vendor && !vendorMap.has(service.vendor.id)) {
          vendorMap.set(service.vendor.id, service.vendor);
        }
      });

      // Convert map to array
      setVendors(Array.from(vendorMap.values()));
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter vendors based on search term
  const filteredVendors = vendors.filter((vendor) =>
    vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Start a new conversation</DialogTitle>
      <DialogContent>
        <DialogContentText paragraph>
          Select a vendor to start chatting with.
        </DialogContentText>

        <TextField
          fullWidth
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ mt: 2 }}>
            {filteredVendors.length === 0 ? (
              <Typography align="center" color="text.secondary" py={3}>
                {searchTerm
                  ? "No vendors found matching your search"
                  : "No vendors available"}
              </Typography>
            ) : (
              filteredVendors.map((vendor) => (
                <ListItem
                  component="div"
                  onClick={() => onSelect(vendor.userId || vendor.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  key={vendor.id}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {vendor.businessName?.charAt(0) || <PersonIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={vendor.businessName}
                    secondary={`${vendor.category || "Vendor"} ${
                      vendor.userId ? "" : "(No user ID found)"
                    }`}
                  />
                </ListItem>
              ))
            )}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ChatInterface = ({ vendorId, onBack }) => {
  const {
    conversations,
    loading,
    error,
    currentConversation,
    messages,
    startConversation,
    selectConversation,
    sendMessage,
  } = useConversations();

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [initializing, setInitializing] = useState(false);
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);

  // Initialize conversation with vendor if vendorId is provided
  useEffect(() => {
    if (vendorId && conversations.length > 0 && !initializing) {
      // Check if we already have a conversation with this vendor
      const existingConversation = conversations.find((c) =>
        c.participants.some((p) => p.id === vendorId || p.userId === vendorId)
      );

      if (existingConversation) {
        // Select existing conversation
        selectConversation(existingConversation);
      } else {
        // Start new conversation
        setInitializing(true);
        startConversation(vendorId)
          .then(() => setInitializing(false))
          .catch(() => setInitializing(false));
      }
    }
  }, [
    vendorId,
    conversations,
    selectConversation,
    startConversation,
    initializing,
  ]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation) return;

    // Find the vendor participant to send to
    const vendor = currentConversation.participants.find(
      (p) => p.role === "VENDOR"
    );

    if (vendor) {
      sendMessage(newMessage, vendor.id);
      setNewMessage("");
    }
  };

  const handleStartNewConversation = (selectedVendorId) => {
    if (selectedVendorId) {
      // Check if we already have a conversation with this vendor
      const existingConversation = conversations.find((c) =>
        c.participants.some(
          (p) => p.id === selectedVendorId || p.userId === selectedVendorId
        )
      );

      if (existingConversation) {
        // If conversation exists, just select it instead of creating a new one
        selectConversation(existingConversation);
        setNewChatDialogOpen(false);
      } else {
        // Start new conversation if one doesn't exist
        setInitializing(true);
        startConversation(selectedVendorId)
          .then(() => {
            setNewChatDialogOpen(false);
            setInitializing(false);
          })
          .catch((error) => {
            console.error("Error starting conversation:", error);
            setInitializing(false);
            setNewChatDialogOpen(false);
          });
      }
    }
  };

  return (
    <Box sx={{ display: "flex", height: "70vh", borderRadius: 1 }}>
      {/* Conversations List */}
      <Paper
        elevation={0}
        sx={{
          width: 300,
          borderRight: 1,
          borderColor: "divider",
          display: { xs: currentConversation ? "none" : "block", md: "block" },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ChatIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Conversations</Typography>
          </Box>
          <Button
            size="small"
            color="primary"
            onClick={() => setNewChatDialogOpen(true)}
          >
            New
          </Button>
        </Box>
        <ConversationList
          conversations={conversations}
          currentId={currentConversation?.id}
          onSelect={selectConversation}
          loading={loading}
        />
      </Paper>

      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {currentConversation ? (
          <>
            {/* Conversation Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                  onClick={() => selectConversation(null)}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Avatar sx={{ mr: 1 }}>
                  {currentConversation.participants
                    .find((p) => p.role === "VENDOR")
                    ?.businessName?.charAt(0) || <PersonIcon />}
                </Avatar>
                <Typography variant="h6">
                  {currentConversation.participants.find(
                    (p) => p.role === "VENDOR"
                  )?.businessName || "Vendor"}
                </Typography>
              </Box>
              {onBack && (
                <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
                  Back
                </Button>
              )}
            </Box>

            {/* Messages Area */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {messages.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <ChatIcon sx={{ fontSize: 60, color: "action.disabled" }} />
                  <Typography variant="body1" color="text.secondary" mt={2}>
                    No messages yet. Start the conversation!
                  </Typography>
                </Box>
              ) : (
                messages.map((message) => {
                  // Find vendor in current conversation
                  const vendorId = currentConversation?.participants?.find(
                    (p) => p.role === "VENDOR"
                  )?.id;

                  // Determine if message is from current user (not from vendor)
                  const isOwnMessage = message.fromUserId !== vendorId;

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwnMessage={isOwnMessage}
                    />
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Box
              component="form"
              onSubmit={handleSendMessage}
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: "divider",
                display: "flex",
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                size="small"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                type="submit"
                disabled={!newMessage.trim()}
              >
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <ChatIcon sx={{ fontSize: 80, color: "action.disabled" }} />
            <Typography variant="h6" color="text.secondary" mt={2}>
              Select a conversation to start chatting
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Or create a new conversation with a vendor
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setNewChatDialogOpen(true)}
              sx={{ mt: 3, mb: 2 }}
            >
              New Conversation
            </Button>
            {onBack && (
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                sx={{ mt: 1 }}
              >
                Back to Bookings
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* New Conversation Dialog */}
      <NewConversationDialog
        open={newChatDialogOpen}
        onClose={() => setNewChatDialogOpen(false)}
        onSelect={handleStartNewConversation}
      />
    </Box>
  );
};

export default ChatInterface;
