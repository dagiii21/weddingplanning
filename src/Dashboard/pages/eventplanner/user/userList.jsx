import React, { useState } from "react";
import { API_BASE_URL } from "../../../../config/env";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  useRecordContext,
  useNotify,
  useRefresh,
  TextInput,
  Filter,
  FunctionField,
  Confirm,
  SimpleShowLayout,
  useDataProvider,
  Loading,
  DateField,
} from "react-admin";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
  List as MuiList,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";
import { eventPlannerService } from "../../../../services/api";

// Filter component for searching clients
const ClientFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search First Name" source="firstName_like" alwaysOn />
    <TextInput label="Search Last Name" source="lastName_like" />
    <TextInput label="Search Email" source="email_like" />
  </Filter>
);

// Block/Unblock button component
const BlockButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!record) return null;

  const handleBlock = async () => {
    try {
      await eventPlannerService.toggleClientBlock(record.id, !record.isBlocked);
      notify(
        record.isBlocked
          ? "Client has been unblocked"
          : "Client has been blocked",
        { type: "success" }
      );
      refresh();
      setConfirmOpen(false);
    } catch (error) {
      notify(`Error: ${error.message || "Operation failed"}`, {
        type: "error",
      });
    }
  };

  return (
    <>
      <Tooltip title={record.isBlocked ? "Unblock Client" : "Block Client"}>
        <IconButton
          onClick={() => setConfirmOpen(true)}
          color={record.isBlocked ? "warning" : "default"}
        >
          <BlockIcon />
        </IconButton>
      </Tooltip>

      <Confirm
        isOpen={confirmOpen}
        title={record.isBlocked ? "Unblock Client" : "Block Client"}
        content={
          record.isBlocked
            ? "Are you sure you want to unblock this client? They will be able to log in and use the system again."
            : "Are you sure you want to block this client? They will not be able to log in."
        }
        onConfirm={handleBlock}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
};

// Client booking stats component
const BookingStatsField = () => {
  const record = useRecordContext();

  if (!record || !record.bookingCounts) return null;

  return (
    <Box display="flex" gap={1} flexWrap="wrap">
      {record.bookingCounts.total > 0 ? (
        <>
          <Chip
            label={`Total: ${record.bookingCounts.total}`}
            size="small"
            variant="outlined"
          />
          {record.bookingCounts.pending > 0 && (
            <Chip
              label={`Pending: ${record.bookingCounts.pending}`}
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
          {record.bookingCounts.confirmed > 0 && (
            <Chip
              label={`Confirmed: ${record.bookingCounts.confirmed}`}
              size="small"
              color="success"
              variant="outlined"
            />
          )}
        </>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No bookings
        </Typography>
      )}
    </Box>
  );
};

// Client Detail Modal
const ClientDetailModal = ({ open, onClose, clientId }) => {
  const dataProvider = useDataProvider();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    if (clientId && open) {
      setLoading(true);

      // Direct API call using the eventPlannerService instead of dataProvider
      // This avoids the format issues with React Admin dataProvider
      fetch(`${API_BASE_URL}/eventplanner/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch client details");
          }
          return response.json();
        })
        .then((responseData) => {
          // Check if data is wrapped in a data property (as we just updated the backend)
          const clientData = responseData.data || responseData;
          setClient(clientData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching client:", err);
          setError(err.message || "Error loading client details");
          setLoading(false);
        });
    }
  }, [clientId, open]);

  if (!open) return null;

  // Rest of the component remains unchanged
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      scroll="paper"
    >
      <DialogTitle>
        Client Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Loading />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : client ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mb={2}
                  >
                    <Avatar
                      src={client.avatar}
                      sx={{ width: 80, height: 80, mb: 2 }}
                    >
                      {client.firstName?.charAt(0) ||
                        client.user?.firstName?.charAt(0)}
                    </Avatar>
                    <Typography variant="h6">
                      {client.firstName || client.user?.firstName}{" "}
                      {client.lastName || client.user?.lastName}
                    </Typography>
                    <Typography color="textSecondary">
                      {client.email || client.user?.email}
                    </Typography>
                    {client.phone && (
                      <Typography color="textSecondary">
                        {client.phone}
                      </Typography>
                    )}
                    {(client.isBlocked || client.user?.isBlocked) && (
                      <Chip
                        label="Blocked"
                        color="error"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Joined on
                  </Typography>
                  <Typography gutterBottom>
                    {new Date(
                      client.createdAt || client.user?.createdAt
                    ).toLocaleDateString()}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Total Spent
                  </Typography>
                  <Typography>
                    ETB {client.totalSpent?.toLocaleString() || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Booking History
                  </Typography>
                  {client.bookings?.length > 0 ? (
                    <MuiList>
                      {client.bookings.map((booking) => (
                        <ListItem
                          key={booking.id}
                          divider
                          alignItems="flex-start"
                          sx={{ px: 0 }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              <EventIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1">
                                {booking.service?.name || "Service"}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="textPrimary"
                                >
                                  {new Date(
                                    booking.eventDate
                                  ).toLocaleDateString()}
                                </Typography>
                                <Typography component="div" variant="body2">
                                  {booking.location}
                                </Typography>
                                <Chip
                                  label={booking.status}
                                  size="small"
                                  color={
                                    booking.status === "COMPLETED"
                                      ? "success"
                                      : booking.status === "CONFIRMED"
                                      ? "primary"
                                      : booking.status === "PENDING"
                                      ? "warning"
                                      : "default"
                                  }
                                  sx={{ mt: 1 }}
                                />
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </MuiList>
                  ) : (
                    <Typography color="textSecondary">
                      No bookings found for this client.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Typography>No client data available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Client List with Modal for details
const UserListOne = () => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenDetails = (id) => {
    setSelectedClientId(id);
    setDetailModalOpen(true);
  };

  return (
    <>
      <List
        filters={<ClientFilter />}
        sort={{ field: "createdAt", order: "DESC" }}
      >
        {isMobile ? (
          <MobileClientList onViewDetails={handleOpenDetails} />
        ) : (
          <DesktopClientList onViewDetails={handleOpenDetails} />
        )}
      </List>

      <ClientDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        clientId={selectedClientId}
      />
    </>
  );
};

// Mobile-friendly list view
const MobileClientList = ({ onViewDetails }) => {
  const dataProvider = useDataProvider();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    dataProvider
      .getList("user", {
        pagination: { page: 1, perPage: 20 },
        sort: { field: "createdAt", order: "DESC" },
      })
      .then(({ data }) => {
        setClients(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [dataProvider]);

  if (loading) return <Loading />;

  return (
    <Box sx={{ mt: 2 }}>
      {clients.map((client) => (
        <Card key={client.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="subtitle1">
                  {client.firstName} {client.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {client.email}
                </Typography>
                {client.isBlocked && (
                  <Chip
                    label="Blocked"
                    size="small"
                    color="error"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
              <Box>
                <Tooltip title="View Details">
                  <IconButton onClick={() => onViewDetails(client.id)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <BlockButton record={client} />
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Total Spent
                </Typography>
                <Typography variant="body2">
                  ETB {client.totalSpent?.toLocaleString() || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Bookings
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <BookingStatsField record={client} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

// Desktop table view
const DesktopClientList = ({ onViewDetails }) => {
  return (
    <Datagrid>
      <FunctionField
        label="Name"
        render={(record) => `${record.firstName} ${record.lastName}`}
      />
      <EmailField source="email" />
      <TextField source="phone" />
      <FunctionField
        label="Bookings"
        render={(record) => <BookingStatsField />}
      />
      <FunctionField
        label="Total Spent"
        render={(record) => `ETB ${record.totalSpent?.toLocaleString() || 0}`}
      />
      <FunctionField
        label="Block/Unblock"
        render={(record) => <BlockButton />}
      />
      <FunctionField
        label="Details"
        render={(record) => (
          <IconButton onClick={() => onViewDetails(record.id)}>
            <VisibilityIcon />
          </IconButton>
        )}
      />
    </Datagrid>
  );
};

export default UserListOne;
