import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  MonetizationOn as MoneyIcon,
  PendingActions as PendingIcon,
  AccountBalanceWallet as WalletIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import useVendorPayments from "../../../../hooks/useVendorPayments";

const PaymentDashboard = () => {
  const { payments, loading, error } = useVendorPayments();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getStatusChip = (status) => {
    if (!status) return <Chip label="Unknown" color="default" size="small" />;

    switch (status.toUpperCase()) {
      case "COMPLETED":
        return <Chip label="Completed" color="success" size="small" />;
      case "PENDING":
        return <Chip label="Pending" color="warning" size="small" />;
      case "FAILED":
        return <Chip label="Failed" color="error" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
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
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" component="h1" gutterBottom>
        Payment Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                <WalletIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Earnings
                </Typography>
                <Typography variant="h5">
                  ETB {payments.totalPayments?.toLocaleString() || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                <MoneyIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Received Payments
                </Typography>
                <Typography variant="h5">
                  {payments.receivedPayments?.length || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                <PendingIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Pending Payments
                </Typography>
                <Typography variant="h5">
                  {payments.pendingPayments?.length || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Lists */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Received Payments" />
            <Tab label="Pending Payments" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {payments.receivedPayments?.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography variant="body1" color="text.secondary">
                No received payments yet.
              </Typography>
            </Box>
          ) : (
            <List>
              {payments.receivedPayments?.map((payment, index) => (
                <React.Fragment key={payment.id || index}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="subtitle1">
                            {payment.booking?.service?.name || "Payment"}
                          </Typography>
                          <Typography variant="h6" color="primary.main">
                            ETB {payment.amount?.toLocaleString() || 0}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box mt={1}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" component="span">
                                Client: {payment.client?.user?.firstName}{" "}
                                {payment.client?.user?.lastName}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Typography variant="body2" component="span">
                                Payment Date: {formatDate(payment.createdAt)}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Typography variant="body2" component="span">
                                Method: {payment.paymentMethod || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              {getStatusChip(payment.status)}
                            </Grid>
                          </Grid>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < payments.receivedPayments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {payments.pendingPayments?.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography variant="body1" color="text.secondary">
                No pending payments.
              </Typography>
            </Box>
          ) : (
            <List>
              {payments.pendingPayments?.map((payment, index) => (
                <React.Fragment key={payment.id || index}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="subtitle1">
                            {payment.booking?.service?.name || "Payment"}
                          </Typography>
                          <Typography variant="h6" color="primary.main">
                            ETB {payment.amount?.toLocaleString() || 0}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box mt={1}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" component="span">
                                Client: {payment.client?.user?.firstName}{" "}
                                {payment.client?.user?.lastName}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Typography variant="body2" component="span">
                                Created Date: {formatDate(payment.createdAt)}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Typography variant="body2" component="span">
                                Method: {payment.paymentMethod || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              {getStatusChip(payment.status)}
                            </Grid>
                          </Grid>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < payments.pendingPayments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default PaymentDashboard;
