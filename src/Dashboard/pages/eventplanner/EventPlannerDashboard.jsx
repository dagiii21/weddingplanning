import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Avatar,
  CircularProgress,
  Chip,
  Alert,
} from "@mui/material";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import StoreIcon from "@mui/icons-material/Store";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const MetricCard = styled(StyledCard)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const DashboardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(2),
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: "bold",
  backgroundColor:
    status === "PENDING"
      ? theme.palette.warning.light
      : status === "CONFIRMED"
      ? theme.palette.success.light
      : status === "COMPLETED"
      ? theme.palette.info.light
      : status === "CANCELLED"
      ? theme.palette.error.light
      : theme.palette.grey[300],
  color:
    status === "PENDING"
      ? theme.palette.warning.contrastText
      : status === "CONFIRMED"
      ? theme.palette.success.contrastText
      : status === "COMPLETED"
      ? theme.palette.info.contrastText
      : status === "CANCELLED"
      ? theme.palette.error.contrastText
      : theme.palette.text.primary,
}));

const EventPlannerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [plannerName, setPlannerName] = useState("");

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/eventplanner/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDashboardData(response.data);

        // Get user data from session storage
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        if (userData) {
          setPlannerName(`${userData.firstName} ${userData.lastName}`);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const HomeButton = () => {
    return (
      <Button
        variant="text"
        startIcon={<HomeIcon />}
        onClick={() => navigate("/")}
        sx={{ marginBottom: 2 }}
      >
        Home
      </Button>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <HomeButton />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <HomeButton />

      <DashboardHeader>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Event Planner Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {plannerName}
          </Typography>
        </Box>
      </DashboardHeader>

      {/* Metrics Grid */}
      <Typography variant="h6" gutterBottom>
        Platform Overview
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="text.secondary" gutterBottom>
                  Total Vendors
                </Typography>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <StoreIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" component="div">
                {dashboardData?.totalVendors || 0}
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="text.secondary" gutterBottom>
                  Total Clients
                </Typography>
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" component="div">
                {dashboardData?.totalClients || 0}
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="text.secondary" gutterBottom>
                  Total Bookings
                </Typography>
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <EventIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" component="div">
                {dashboardData?.totalBookings || 0}
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="text.secondary" gutterBottom>
                  Total Payments
                </Typography>
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <AttachMoneyIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" component="div">
                {dashboardData?.totalPayments || 0}
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Recent Data */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader
              title="Recent Vendors"
              action={
                <IconButton
                  aria-label="settings"
                  onClick={() => navigate("/dashboard/vendor")}
                >
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ flexGrow: 1 }}>
              {dashboardData?.recentVendors?.length > 0 ? (
                <List>
                  {dashboardData.recentVendors.map((vendor) => (
                    <ListItem key={vendor.id} divider>
                      <ListItemIcon>
                        <Avatar src={vendor.user.avatar || ""}>
                          {vendor.user.firstName.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={vendor.businessName}
                        secondary={`${vendor.user.firstName} ${vendor.user.lastName}`}
                      />
                      <StatusChip
                        label={vendor.status}
                        status={vendor.status}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box display="flex" justifyContent="center" p={3}>
                  <Typography>No vendors available</Typography>
                </Box>
              )}
            </CardContent>
            <Box p={2} display="flex" justifyContent="center">
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/dashboard/vendor")}
              >
                View All Vendors
              </Button>
            </Box>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader
              title="Recent Clients"
              action={
                <IconButton
                  aria-label="settings"
                  onClick={() => navigate("/dashboard/user")}
                >
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ flexGrow: 1 }}>
              {dashboardData?.recentClients?.length > 0 ? (
                <List>
                  {dashboardData.recentClients.map((client) => (
                    <ListItem key={client.id} divider>
                      <ListItemIcon>
                        <Avatar src={client.user.avatar || ""}>
                          {client.user.firstName.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={`${client.user.firstName} ${client.user.lastName}`}
                        secondary={client.user.email}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box display="flex" justifyContent="center" p={3}>
                  <Typography>No clients available</Typography>
                </Box>
              )}
            </CardContent>
            <Box p={2} display="flex" justifyContent="center">
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/dashboard/user")}
              >
                View All Clients
              </Button>
            </Box>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Recent Bookings */}
      <Typography variant="h6" gutterBottom mt={4}>
        Recent Bookings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              {dashboardData?.recentBookings?.length > 0 ? (
                <List>
                  {dashboardData.recentBookings.map((booking) => (
                    <ListItem
                      key={booking.id}
                      divider
                      sx={{ flexDirection: "column", alignItems: "flex-start" }}
                    >
                      <Box
                        display="flex"
                        width="100%"
                        alignItems="center"
                        mb={1}
                      >
                        <EventIcon color="primary" sx={{ mr: 2 }} />
                        <Box flexGrow={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {booking.service.name || "Unnamed Service"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Client: {booking.client.user.firstName}{" "}
                            {booking.client.user.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Vendor: {booking.service.vendor.businessName}
                          </Typography>
                        </Box>
                        <StatusChip
                          label={booking.status}
                          status={booking.status}
                          size="small"
                        />
                      </Box>
                      <Box
                        display="flex"
                        width="100%"
                        justifyContent="space-between"
                        pl={5}
                      >
                        <Box display="flex" alignItems="center">
                          <AccessTimeIcon
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                            color="action"
                          />
                          <Typography variant="body2">
                            {new Date(booking.eventDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <LocationOnIcon
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                            color="action"
                          />
                          <Typography variant="body2">
                            {booking.location}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box display="flex" justifyContent="center" p={3}>
                  <Typography>No recent bookings available</Typography>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Chart Cards */}
      <Typography variant="h6" gutterBottom mt={4}>
        Platform Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader title="Top Vendor Categories" />
            <Divider />
            <CardContent>
              {dashboardData?.topVendorCategories?.length > 0 ? (
                <List>
                  {dashboardData.topVendorCategories.map((category, index) => (
                    <ListItem key={index} divider>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {index + 1}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={category.serviceType}
                        secondary={`${category.count} vendors`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box display="flex" justifyContent="center" p={3}>
                  <Typography>No vendor categories data available</Typography>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader title="Booking Status Distribution" />
            <Divider />
            <CardContent>
              {dashboardData?.bookingStats?.length > 0 ? (
                <List>
                  {dashboardData.bookingStats.map((stat, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={stat.status}
                        secondary={`${stat.count} bookings`}
                      />
                      <StatusChip
                        label={stat.status}
                        status={stat.status}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box display="flex" justifyContent="center" p={3}>
                  <Typography>No booking statistics available</Typography>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventPlannerDashboard;
