import React, { useState, useEffect } from "react";
import { useNotify, Title } from "react-admin";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Divider,
  Button,
  Avatar,
  CircularProgress,
  Tab,
  Tabs,
  Alert,
  TextField,
} from "@mui/material";
import useVendorAccount from "../../../../hooks/useVendorAccount";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const validatePasswordMatch = (password, confirmPassword) => {
  if (confirmPassword && confirmPassword !== password) {
    return "Passwords do not match";
  }
  return null;
};

const validatePasswordStrength = (password) => {
  if (!password) return null;

  const hasMinLength = password.length >= 6;

  if (!hasMinLength) return "Password must be at least 6 characters";
  return null;
};

const AccountSettings = () => {
  const notify = useNotify();
  const {
    profile,
    stats,
    loading: profileLoading,
    error,
    updateLoading,
    updateAccount,
  } = useVendorAccount();
  const [tabValue, setTabValue] = useState(0);
  const [passwordValues, setPasswordValues] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: null,
    confirmPassword: null,
  });
  const [profileValues, setProfileValues] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    avatar: "",
    businessName: "",
    description: "",
    serviceType: "",
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      setProfileValues({
        email: profile.email || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        avatar: profile.avatar || "",
        businessName: profile.vendorDetails?.businessName || "",
        description: profile.vendorDetails?.description || "",
        serviceType: profile.vendorDetails?.serviceType || "",
      });
    }
  }, [profile]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));

    // Validate as user types
    if (name === "newPassword") {
      const error = validatePasswordStrength(value);
      setPasswordErrors((prev) => ({ ...prev, newPassword: error }));

      // Also validate confirm password if it exists
      if (passwordValues.confirmPassword) {
        const matchError = validatePasswordMatch(
          value,
          passwordValues.confirmPassword
        );
        setPasswordErrors((prev) => ({ ...prev, confirmPassword: matchError }));
      }
    } else if (name === "confirmPassword") {
      const error = validatePasswordMatch(passwordValues.newPassword, value);
      setPasswordErrors((prev) => ({ ...prev, confirmPassword: error }));
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileValues((prev) => ({ ...prev, [name]: value }));

    // Clear any error for this field
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateProfileFields = () => {
    const errors = {};
    const requiredFields = ["email", "firstName", "lastName", "businessName"];

    requiredFields.forEach((field) => {
      if (!profileValues[field]?.trim()) {
        errors[field] = "This field is required";
      }
    });

    // Email validation
    if (profileValues.email && !/\S+@\S+\.\S+/.test(profileValues.email)) {
      errors.email = "Please enter a valid email address";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate password strength and match
    const strengthError = validatePasswordStrength(passwordValues.newPassword);
    const matchError = validatePasswordMatch(
      passwordValues.newPassword,
      passwordValues.confirmPassword
    );

    setPasswordErrors({
      newPassword: strengthError,
      confirmPassword: matchError,
    });

    if (strengthError || matchError) {
      return;
    }

    try {
      const success = await updateAccount({
        password: passwordValues.newPassword,
      });

      if (success) {
        notify("Password updated successfully", { type: "success" });
        setPasswordValues({
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      notify("Error updating password: " + (error.message || "Unknown error"), {
        type: "error",
      });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileFields()) {
      return;
    }

    try {
      const success = await updateAccount(profileValues);

      if (success) {
        notify("Profile updated successfully", { type: "success" });
      }
    } catch (error) {
      notify("Error updating profile: " + (error.message || "Unknown error"), {
        type: "error",
      });
    }
  };

  if (profileLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div>
      <Title title="Account Settings" />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="account settings tabs"
        >
          <Tab label="Profile Information" />
          <Tab label="Password" />
        </Tabs>
      </Box>

      {/* Profile Information Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            {profile && (
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar
                      src={profile.avatar}
                      alt={profile.firstName}
                      sx={{ width: 80, height: 80 }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h5">
                      {profile.firstName} {profile.lastName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {profile.vendorDetails?.businessName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {profile.email}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            <form onSubmit={handleProfileSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    value={profileValues.email}
                    onChange={handleProfileChange}
                    required
                    error={!!profileErrors.email}
                    helperText={profileErrors.email}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    name="phone"
                    label="Phone Number"
                    fullWidth
                    value={profileValues.phone || ""}
                    onChange={handleProfileChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    fullWidth
                    value={profileValues.firstName}
                    onChange={handleProfileChange}
                    required
                    error={!!profileErrors.firstName}
                    helperText={profileErrors.firstName}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    value={profileValues.lastName}
                    onChange={handleProfileChange}
                    required
                    error={!!profileErrors.lastName}
                    helperText={profileErrors.lastName}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="avatar"
                    label="Profile Image URL"
                    fullWidth
                    value={profileValues.avatar || ""}
                    onChange={handleProfileChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Business Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="businessName"
                    label="Business Name"
                    fullWidth
                    value={profileValues.businessName}
                    onChange={handleProfileChange}
                    required
                    error={!!profileErrors.businessName}
                    helperText={profileErrors.businessName}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Business Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={profileValues.description || ""}
                    onChange={handleProfileChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="serviceType"
                    label="Service Type"
                    fullWidth
                    value={profileValues.serviceType || ""}
                    onChange={handleProfileChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={updateLoading}
                    >
                      {updateLoading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Password Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Change Password
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Password must be at least 6 characters long.
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="newPassword"
                    type="password"
                    label="New Password"
                    fullWidth
                    value={passwordValues.newPassword}
                    onChange={handlePasswordChange}
                    required
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword}
                    autoComplete="new-password"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="confirmPassword"
                    type="password"
                    label="Confirm New Password"
                    fullWidth
                    value={passwordValues.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword}
                    autoComplete="new-password"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={updateLoading}
                    >
                      {updateLoading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Account Statistics Card */}
      {stats && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Statistics
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  textAlign="center"
                  p={2}
                  sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                >
                  <Typography variant="h4" color="primary">
                    {stats.totalBookings}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Bookings
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box
                  textAlign="center"
                  p={2}
                  sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                >
                  <Typography variant="h4" color="primary">
                    {stats.services}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Services Offered
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box
                  textAlign="center"
                  p={2}
                  sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                >
                  <Typography variant="h4" color="primary">
                    {stats.payments?.count || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Completed Payments
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box
                  textAlign="center"
                  p={2}
                  sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                >
                  <Typography variant="h4" color="primary">
                    ETB {stats.payments?.totalAmount?.toLocaleString() || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Earnings
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountSettings;
