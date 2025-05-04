import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  InputAdornment,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  MoreVert as MoreVertIcon,
  InsertEmoticon as EmojiIcon,
  AttachFile as AttachIcon,
} from "@mui/icons-material";
import useVendorChat from "../../../../hooks/useVendorChat";
import { format } from "date-fns";

const ChatInterface = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const {
    currentConversation,
    messages,
    loading,
    error,
    selectConversation,
    sendMessage,
    fetchConversations,
  } = useVendorChat();
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

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

  // Load conversation when the component mounts or conversationId changes
  useEffect(() => {
    const loadConversation = async () => {
      // Get conversations first if they're not loaded
      await fetchConversations();

      // Find the conversation in our list
      if (conversationId) {
        selectConversation({ id: conversationId });
      }
    };

    loadConversation();
  }, [conversationId, selectConversation, fetchConversations]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      sendMessage(newMessage.trim());
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    return format(new Date(timestamp), "h:mm a");
  };

  if (loading && !currentConversation) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error" variant="h6" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => selectConversation({ id: conversationId })}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  if (!currentConversation) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6" gutterBottom>
          Conversation not found
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/chats")}
        >
          Back to Conversations
        </Button>
      </Box>
    );
  }

  const client = currentConversation.client || {};

  return (
    <Box
      sx={{
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Chat Header */}
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/chats")}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Avatar sx={{ mr: 2 }}>
            {client.avatar ? (
              <img src={client.avatar} alt={client.firstName} />
            ) : (
              <PersonIcon />
            )}
          </Avatar>

          <Box flexGrow={1}>
            <Typography variant="h6">
              {client.firstName} {client.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {client.isOnline ? "Online" : "Offline"}
            </Typography>
          </Box>

          <IconButton color="inherit" disabled>
            <PhoneIcon />
          </IconButton>
          <IconButton color="inherit" disabled>
            <VideoCallIcon />
          </IconButton>
          <IconButton color="inherit" disabled>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: "grey.50",
          p: 2,
        }}
      >
        {messages.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No messages yet
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Send a message to start the conversation
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    message.senderId === user?.id ? "flex-end" : "flex-start",
                  p: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection:
                      message.senderId === user?.id ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  {message.senderId !== user?.id && (
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {client.avatar ? (
                          <img src={client.avatar} alt={client.firstName} />
                        ) : (
                          <PersonIcon />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                  )}

                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor:
                        message.senderId === user?.id
                          ? "primary.main"
                          : "background.paper",
                      color:
                        message.senderId === user?.id
                          ? "white"
                          : "text.primary",
                      ml: message.senderId === user?.id ? 1 : 0,
                      mr: message.senderId !== user?.id ? 1 : 0,
                      opacity: message.isOptimistic ? 0.7 : 1,
                      border: message.isOptimistic ? "1px dashed grey" : "none",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {message.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        mt: 0.5,
                        opacity: 0.8,
                      }}
                    >
                      {formatMessageTime(message.createdAt)}
                    </Typography>
                  </Paper>
                </Box>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      {/* Message Input */}
      <Box sx={{ p: 2, bgcolor: "background.paper" }}>
        <form onSubmit={handleSend}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton disabled>
                    <EmojiIcon />
                  </IconButton>
                  <IconButton disabled>
                    <AttachIcon />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    color="primary"
                    disabled={!newMessage.trim() || sending}
                  >
                    {sending ? <CircularProgress size={24} /> : <SendIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Box>
    </Box>
  );
};

export default ChatInterface;
