import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Badge,
  Paper,
  Card,
  CardContent,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import useVendorChat from "../../../../hooks/useVendorChat";
import useVendorBookings from "../../../../hooks/useVendorBookings";
import { format, isToday, isYesterday } from "date-fns";

const ChatList = () => {
  const navigate = useNavigate();
  const {
    conversations,
    loading,
    error,
    fetchConversations,
    startConversation,
  } = useVendorChat();
  const { fetchBookings, bookings } = useVendorBookings();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentClients, setRecentClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);

  // Fetch conversations and recent clients on component mount
  useEffect(() => {
    fetchConversations();
    loadRecentClients();
  }, [fetchConversations]);

  const loadRecentClients = async () => {
    setClientsLoading(true);
    try {
      // Fetch unique clients from bookings
      await fetchBookings();
    } catch (err) {
      console.error("Error loading recent clients:", err);
    } finally {
      setClientsLoading(false);
    }
  };

  // Process bookings to get unique clients
  useEffect(() => {
    if (bookings.length > 0) {
      // Get unique clients from bookings
      const uniqueClients = [];
      const clientIds = new Set();

      bookings.forEach((booking) => {
        const clientId = booking.client.userId;
        if (!clientIds.has(clientId)) {
          clientIds.add(clientId);
          uniqueClients.push({
            id: clientId,
            name: `${booking.client.user.firstName} ${booking.client.user.lastName}`,
            email: booking.client.user.email,
            avatar: booking.client.user.avatar || null,
            lastActivity: booking.createdAt,
          });
        }
      });

      // Sort by most recent activity
      uniqueClients.sort(
        (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)
      );

      setRecentClients(uniqueClients.slice(0, 5)); // Limit to 5 most recent clients
    }
  }, [bookings]);

  const startNewChat = async (clientId) => {
    try {
      const conversation = await startConversation(clientId);
      if (conversation) {
        navigate(`/chats/${conversation.id}`);
      }
    } catch (err) {
      console.error("Error starting new chat:", err);
    }
  };

  const openConversation = (conversationId) => {
    navigate(`/chats/${conversationId}`);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };

  const getLastMessage = (conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return "No messages yet";
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.content.length > 30
      ? lastMessage.content.substring(0, 30) + "..."
      : lastMessage.content;
  };

  const getLastMessageTime = (conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return "";
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return formatTime(lastMessage.createdAt);
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    const clientName = `${conversation.client?.firstName || ""} ${
      conversation.client?.lastName || ""
    }`.toLowerCase();
    return clientName.includes(searchQuery.toLowerCase());
  });

  if (loading && conversations.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchConversations} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" component="h1" gutterBottom>
        Messages
      </Typography>

      {/* Search Box */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {/* Recent Clients Section */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Clients
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {clientsLoading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight="100px"
                >
                  <CircularProgress size={24} />
                </Box>
              ) : recentClients.length > 0 ? (
                <List dense>
                  {recentClients.map((client) => (
                    <ListItem
                      key={client.userId}
                      button
                      onClick={() => startNewChat(client.userId)}
                      sx={{ borderRadius: 1, mb: 1 }}
                    >
                      <ListItemAvatar>
                        <Avatar src={client.avatar} alt={client.name}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={client.name}
                        secondary={client.email}
                      />
                      <IconButton size="small" color="primary" edge="end">
                        <MessageIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box py={2} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No recent clients found
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Conversations List */}
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ mb: 3 }}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Your Conversations
              </Typography>
              <Divider />

              {filteredConversations.length > 0 ? (
                <List>
                  {filteredConversations.map((conversation) => (
                    <React.Fragment key={conversation.id}>
                      <ListItem
                        button
                        onClick={() => openConversation(conversation.id)}
                        sx={{
                          borderRadius: 1,
                          bgcolor:
                            conversation.unreadCount > 0
                              ? "action.hover"
                              : "transparent",
                          "&:hover": { bgcolor: "action.selected" },
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            color="primary"
                            badgeContent={conversation.unreadCount}
                            overlap="circular"
                          >
                            <Avatar src={conversation.client?.avatar}>
                              <PersonIcon />
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between">
                              <Typography
                                variant="body1"
                                fontWeight={
                                  conversation.unreadCount > 0 ? 600 : 400
                                }
                              >
                                {conversation.client?.firstName}{" "}
                                {conversation.client?.lastName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {getLastMessageTime(conversation)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              color={
                                conversation.unreadCount > 0
                                  ? "text.primary"
                                  : "text.secondary"
                              }
                              noWrap
                              fontWeight={
                                conversation.unreadCount > 0 ? 500 : 400
                              }
                            >
                              {getLastMessage(conversation)}
                            </Typography>
                          }
                        />
                        <ArrowForwardIcon
                          fontSize="small"
                          color="action"
                          sx={{ ml: 1 }}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box py={3} textAlign="center">
                  <MessageIcon
                    color="disabled"
                    sx={{ fontSize: 60, mb: 2, opacity: 0.3 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No conversations found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Start chatting with your clients to provide better service
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatList;
