import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Chip,
  CircularProgress,
  IconButton,
  Button,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import ReceiptIcon from "@mui/icons-material/Receipt";
import EventIcon from "@mui/icons-material/Event";
import CreditCardIcon from "@mui/icons-material/CreditCard";

// Import custom hook for client payments
import useClientPayments from "../../../../hooks/useClientPayments";

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

// Status chip component
const StatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PENDING":
        return "warning";
      case "FAILED":
        return "error";
      default:
        return "default";
    }
  };

  return <Chip label={status} color={getStatusColor(status)} size="small" />;
};

// Payment method chip component
const PaymentMethodChip = ({ method }) => {
  // Format the payment method for display
  const formatMethod = (method) => {
    if (method === "NOT_SELECTED") return "Not Selected";
    return method.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Chip
      icon={<CreditCardIcon />}
      label={formatMethod(method)}
      variant="outlined"
      size="small"
    />
  );
};

const PaymentList = () => {
  // Use the custom hook to fetch payments
  const {
    payments,
    pagination,
    loading,
    error,
    changePage,
    changeLimit,
    filterPayments,
    refetch,
  } = useClientPayments();

  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const handlePageChange = (event, page) => {
    changePage(page);
  };

  const handleLimitChange = (event) => {
    changeLimit(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    // Implement actual API filtering when backend supports it
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
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

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Payment History</Typography>
        <Box>
          <IconButton onClick={toggleFilters} color="primary" title="Filter">
            <FilterListIcon />
          </IconButton>
          <IconButton onClick={refetch} color="primary" title="Refresh">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {showFilters && (
        <Box mb={2} p={2} component={Paper} variant="outlined">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="FAILED">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Event Date</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" color="textSecondary" p={3}>
                    No payment records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ReceiptIcon fontSize="small" color="action" />
                      {payment.id.substring(0, 8)}...
                    </Box>
                  </TableCell>
                  <TableCell>{payment.booking.service.name}</TableCell>
                  <TableCell>
                    {payment.booking.service.vendor.businessName}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      ETB {payment.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <PaymentMethodChip method={payment.method} />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <EventIcon fontSize="small" color="primary" />
                      {formatDate(payment.booking.eventDate)}
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>
                    <StatusChip status={payment.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination.pages > 1 && (
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="limit-select-label">Items per page</InputLabel>
            <Select
              labelId="limit-select-label"
              value={pagination.limit}
              label="Items per page"
              onChange={handleLimitChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>

          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default PaymentList;
