import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
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
  Badge,
} from "@mui/material";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import TaskIcon from "@mui/icons-material/Task";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarIcon from "@mui/icons-material/Star";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Custom hook for vendor dashboard
import useVendorDashboard from "../../../hooks/useVendorDashboard";

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

const QuickActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  textTransform: "none",
}));

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { dashboardData, loading, error, refetch } = useVendorDashboard();

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
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" onClick={refetch}>
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  // Create booking events from confirmed bookings
  const upcomingEvents =
    dashboardData.confirmedBookings?.data?.map((booking) => ({
      id: booking.id,
      title: booking.serviceName || "Service Booking",
      date: booking.eventDate,
      status: "Confirmed",
    })) || [];

  return (
    <Box p={3}>
      <HomeButton />

      <DashboardHeader>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Vendor Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {dashboardData.businessName || "Vendor"}
          </Typography>
        </Box>
      </DashboardHeader>

      {/* Dashboard Metrics */}
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
                  Total Bookings
                </Typography>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <EventIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" component="div">
                {dashboardData.totalBookings || 0}
              </Typography>
              <Button
                variant="text"
                size="small"
                sx={{ mt: 1, p: 0 }}
                onClick={() => navigate("/dashboard/bookings")}
              >
                View Bookings
              </Button>
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
                  Revenue
                </Typography>
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <AttachMoneyIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" component="div">
                {dashboardData.revenue?.currency || "ETB"}{" "}
                {(dashboardData.revenue?.total || 0).toLocaleString()}
              </Typography>
              <Button
                variant="text"
                size="small"
                sx={{ mt: 1, p: 0 }}
                onClick={() => navigate("/dashboard/payments")}
              >
                View Revenue
              </Button>
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
                  Rating
                </Typography>
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <StarIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" component="div">
                {(dashboardData.rating || 0).toFixed(1)}
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
                  Services
                </Typography>
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <EventIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" component="div">
                {dashboardData.servicesCount || 0}
              </Typography>
              <Button
                variant="text"
                size="small"
                sx={{ mt: 1, p: 0 }}
                onClick={() => navigate("/dashboard/Mangeservices")}
              >
                Manage Services
              </Button>
            </CardContent>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Upcoming Events and Action Items */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader
              title="Upcoming Events"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ flexGrow: 1 }}>
              <List>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <ListItem key={event.id} divider>
                      <ListItemIcon>
                        <EventIcon
                          color={
                            event.status === "Confirmed" ? "success" : "warning"
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={`${new Date(
                          event.date
                        ).toLocaleDateString()} • ${event.status}`}
                      />
                      <Button size="small" variant="outlined">
                        Details
                      </Button>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary="No upcoming events"
                      secondary="Your confirmed bookings will appear here"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
            <Box p={2} display="flex" justifyContent="center">
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/dashboard/bookings")}
              >
                View All Bookings
              </Button>
            </Box>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader
              title="Action Items"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ flexGrow: 1 }}>
              <List>
                <ListItem divider>
                  <ListItemIcon>
                    <TaskIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Pending Confirmations"
                    secondary={`${
                      dashboardData.pendingBookings?.count || 0
                    } bookings need confirmation`}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate("/dashboard/bookings?filter=PENDING")
                    }
                  >
                    Manage Bookings
                  </Button>
                </ListItem>

                <ListItem divider>
                  <ListItemIcon>
                    <EventIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Manage Services"
                    secondary={`You have ${
                      dashboardData.servicesCount || 0
                    } services listed`}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/dashboard/Mangeservices")}
                  >
                    Manage Services
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorDashboard;
