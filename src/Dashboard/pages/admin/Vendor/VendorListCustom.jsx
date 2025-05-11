import React, { useState, useEffect } from "react";
import { Title, useNotify } from "react-admin";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Stack,
  Container,
  Divider,
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { adminService } from "../../../../services/api";
import { authFetch, handleResponse } from "../../../dataProvider/customFetch";

// Status component that shows vendor status with a colored chip
const VendorStatusField = ({ record }) => {
  if (!record) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING_APPROVAL":
        return "warning";
      case "SUSPENDED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Chip
      label={record.status}
      color={getStatusColor(record.status)}
      variant="outlined"
      size="small"
    />
  );
};

// Approve button component
const ApproveButton = ({ record, onStatusChange }) => {
  const notify = useNotify();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!record || record.status === "APPROVED") return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await adminService.approveVendor(record.id);
      notify("Vendor has been approved successfully", { type: "success" });
      if (onStatusChange) onStatusChange();
      setConfirmOpen(false);
    } catch (error) {
      console.error("Error approving vendor:", error);
      notify(`Error: ${error.message || "Failed to approve vendor"}`, {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Approve Vendor">
        <IconButton
          onClick={() => setConfirmOpen(true)}
          color="success"
          size="small"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
        </IconButton>
      </Tooltip>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Approve Vendor</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve this vendor? They will be able to
            list services and receive payments.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleApprove} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Suspend button component
const SuspendButton = ({ record, onStatusChange }) => {
  const notify = useNotify();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!record || record.status === "SUSPENDED") return null;

  const handleSuspend = async () => {
    try {
      setLoading(true);
      await adminService.suspendVendor(record.id);
      notify("Vendor has been suspended", { type: "success" });
      if (onStatusChange) onStatusChange();
      setConfirmOpen(false);
    } catch (error) {
      console.error("Error suspending vendor:", error);
      notify(`Error: ${error.message || "Failed to suspend vendor"}`, {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Suspend Vendor">
        <IconButton
          onClick={() => setConfirmOpen(true)}
          color="warning"
          size="small"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : <RemoveCircleIcon />}
        </IconButton>
      </Tooltip>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Suspend Vendor</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to suspend this vendor? They will not be able
            to receive new bookings while suspended.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleSuspend} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Block/Unblock button component
const BlockButton = ({ record, onBlockChange }) => {
  const notify = useNotify();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!record) return null;

  const handleBlock = async () => {
    try {
      setProcessing(true);
      await adminService.toggleVendorBlock(record.id, !record.isBlocked);
      notify(
        record.isBlocked
          ? "Vendor has been unblocked"
          : "Vendor has been blocked",
        { type: "success" }
      );
      if (onBlockChange) onBlockChange();
      setConfirmOpen(false);
    } catch (error) {
      console.error("Error toggling vendor block status:", error);
      notify(`Error: ${error.message || "Operation failed"}`, {
        type: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Tooltip title={record.isBlocked ? "Unblock Vendor" : "Block Vendor"}>
        <IconButton
          onClick={() => setConfirmOpen(true)}
          color={record.isBlocked ? "warning" : "default"}
          size="small"
          disabled={processing}
        >
          {processing ? <CircularProgress size={20} /> : <BlockIcon />}
        </IconButton>
      </Tooltip>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
          {record.isBlocked ? "Unblock Vendor" : "Block Vendor"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {record.isBlocked
              ? "Are you sure you want to unblock this vendor? They will be able to log in and use the system again."
              : "Are you sure you want to block this vendor? They will not be able to log in."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleBlock} color="primary" disabled={processing}>
            {processing ? <CircularProgress size={20} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Business Name with edit capability
const BusinessNameField = ({ record, onBusinessInfoChange }) => {
  const notify = useNotify();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [updating, setUpdating] = useState(false);

  if (!record) return null;

  const handleEdit = async () => {
    const updateData = {};
    if (businessName.trim()) updateData.businessName = businessName;
    if (serviceType.trim()) updateData.serviceType = serviceType;

    if (Object.keys(updateData).length === 0) {
      notify("No changes to update", { type: "warning" });
      return;
    }

    try {
      setUpdating(true);
      console.log(`Updating vendor ${record.id} with data:`, updateData);
      const result = await adminService.updateVendor(record.id, updateData);
      console.log("Update result:", result);
      notify("Vendor information updated successfully", { type: "success" });
      if (onBusinessInfoChange) onBusinessInfoChange();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating vendor:", error);
      notify(`Error: ${error.message || "Failed to update vendor"}`, {
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const openEditDialog = () => {
    setBusinessName(record.businessName || "");
    setServiceType(record.serviceType || "");
    setDialogOpen(true);
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <Typography variant="body2">{record.businessName}</Typography>
        <Tooltip title="Edit Vendor">
          <IconButton size="small" onClick={openEditDialog} sx={{ ml: 1 }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Vendor Information</DialogTitle>
        <DialogContent>
          <MuiTextField
            margin="dense"
            label="Business Name"
            fullWidth
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />
          <MuiTextField
            margin="dense"
            label="Service Type"
            fullWidth
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} color="primary" disabled={updating}>
            {updating ? <CircularProgress size={20} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Details dialog component
const VendorDetailsDialog = ({ open, onClose, vendorId }) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const notify = useNotify();

  const fetchVendorDetails = async () => {
    if (!vendorId) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await adminService.getVendorById(vendorId);
      console.log("Vendor details:", data);
      setVendor(data.data || data);
      setError(null);
    } catch (err) {
      console.error("Error fetching vendor:", err);
      setError(err.message || "Error loading vendor details");
      notify(`Error: ${err.message || "Failed to load vendor details"}`, {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId && open) {
      fetchVendorDetails();
    }
  }, [vendorId, open]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!open) return null;

  const renderVendorServices = () => {
    if (!vendor || !vendor.services || vendor.services.length === 0) {
      return (
        <Typography color="textSecondary" align="center" py={3}>
          No services available
        </Typography>
      );
    }

    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Price (ETB)</TableCell>
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendor.services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell align="right">
                  {service.price?.toLocaleString()}
                </TableCell>
                <TableCell>{service.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderBasicInfo = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Business Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Business Name
                  </Typography>
                  <Typography>{vendor?.businessName || "N/A"}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Service Type
                  </Typography>
                  <Typography>{vendor?.serviceType || "N/A"}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={vendor?.status}
                      color={
                        vendor?.status === "APPROVED"
                          ? "success"
                          : vendor?.status === "PENDING_APPROVAL"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                    {vendor?.isBlocked && (
                      <Chip
                        label="Blocked"
                        color="error"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Account Created
                  </Typography>
                  <Typography>
                    {vendor?.createdAt
                      ? new Date(vendor.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Name
                  </Typography>
                  <Typography>{vendor?.name || "N/A"}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Email
                  </Typography>
                  <Typography>{vendor?.email || "N/A"}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Phone
                  </Typography>
                  <Typography>{vendor?.phone || "N/A"}</Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    sx={{ mr: 1 }}
                  >
                    Edit Vendor
                  </Button>

                  <Button
                    variant={vendor?.isBlocked ? "outlined" : "contained"}
                    color={vendor?.isBlocked ? "success" : "error"}
                    size="small"
                    startIcon={vendor?.isBlocked ? null : <BlockIcon />}
                  >
                    {vendor?.isBlocked ? "Unblock Vendor" : "Block Vendor"}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Vendor Details
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
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error">{error}</Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchVendorDetails}
              sx={{ mt: 1 }}
            >
              Retry
            </Button>
          </Box>
        ) : vendor ? (
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="vendor details tabs"
                variant="fullWidth"
              >
                <Tab label="Basic Info" />
                <Tab label="Services" />
              </Tabs>
            </Box>

            {activeTab === 0 && renderBasicInfo()}
            {activeTab === 1 && renderVendorServices()}
          </Box>
        ) : (
          <Typography>No vendor data available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Add Statistics component for the dashboard
const VendorStatistics = ({ vendors }) => {
  // Calculate statistics based on vendor data
  const totalVendors = vendors.length;
  const pendingApproval = vendors.filter(
    (v) => v.status === "PENDING_APPROVAL"
  ).length;
  const approved = vendors.filter((v) => v.status === "APPROVED").length;
  const suspended = vendors.filter((v) => v.status === "SUSPENDED").length;
  const blocked = vendors.filter((v) => v.isBlocked).length;

  // Calculate percentages
  const approvedPercent = totalVendors
    ? Math.round((approved / totalVendors) * 100)
    : 0;
  const pendingPercent = totalVendors
    ? Math.round((pendingApproval / totalVendors) * 100)
    : 0;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Vendor Statistics
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Total Vendors:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {totalVendors}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Pending Approval:</Typography>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="body2"
                    color="warning.main"
                    fontWeight="bold"
                  >
                    {pendingApproval}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    ({pendingPercent}%)
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Approved:</Typography>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight="bold"
                  >
                    {approved}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    ({approvedPercent}%)
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Suspended:</Typography>
                <Typography
                  variant="body2"
                  color="error.main"
                  fontWeight="bold"
                >
                  {suspended}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Blocked:</Typography>
                <Typography
                  variant="body2"
                  color="error.main"
                  fontWeight="bold"
                >
                  {blocked}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Stack spacing={1} width="100%">
                <Typography variant="body2" gutterBottom>
                  Approval Status
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box sx={{ width: "100%", mr: 1 }}>
                    <Box
                      sx={{
                        height: 10,
                        display: "flex",
                        borderRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${approvedPercent}%`,
                          bgcolor: "success.main",
                        }}
                      />
                      <Box
                        sx={{
                          width: `${pendingPercent}%`,
                          bgcolor: "warning.main",
                        }}
                      />
                      <Box
                        sx={{
                          width: `${100 - approvedPercent - pendingPercent}%`,
                          bgcolor: "error.main",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                        mr: 1,
                      }}
                    />
                    <Typography variant="caption">Approved</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "warning.main",
                        mr: 1,
                      }}
                    />
                    <Typography variant="caption">Pending</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "error.main",
                        mr: 1,
                      }}
                    />
                    <Typography variant="caption">Suspended</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Custom VendorList component for admin dashboard
const VendorListCustom = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const notify = useNotify();

  // Load vendors from the API
  const loadVendors = async () => {
    setLoading(true);
    try {
      const start = page * rowsPerPage;
      const end = start + rowsPerPage;

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("_start", start);
      queryParams.append("_end", end);
      queryParams.append("_sort", "businessName");
      queryParams.append("_order", "ASC");

      if (searchTerm) {
        queryParams.append("businessName_like", searchTerm);
      }

      if (statusFilter) {
        queryParams.append("status", statusFilter);
      }

      console.log(
        "Fetching vendors with params:",
        Object.fromEntries(queryParams)
      );

      // Use the adminService directly to avoid URL issues
      const result = await adminService.getVendors({
        _start: start,
        _end: end,
        _sort: "businessName",
        _order: "ASC",
        ...(searchTerm ? { businessName_like: searchTerm } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      });

      console.log("API response:", result);

      if (!result || !result.data) {
        throw new Error("No data received from server");
      }

      const { data, headers } = result;

      // Ensure data is always an array
      if (Array.isArray(data)) {
        console.log("Setting vendors array of length:", data.length);
        setVendors(data);
      } else {
        console.error("Expected array but got:", typeof data);
        setVendors([]);
        throw new Error("Unexpected data format received from server");
      }

      // Get total count from headers if available
      const totalCount = headers?.get("x-total-count");
      if (totalCount) {
        console.log("Setting total count from header:", totalCount);
        setTotal(parseInt(totalCount, 10));
      } else {
        // Use array length as fallback
        setTotal(data.length);
      }

      setError(null);
    } catch (err) {
      console.error("Error loading vendors:", err);
      setError(err.message || "Failed to load vendors");
      notify(`Error: ${err.message || "Failed to load vendors"}`, {
        type: "error",
      });
      setVendors([]); // Ensure vendors is always an array even on error
    } finally {
      setLoading(false);
    }
  };

  // Load vendors when component mounts or filters change
  useEffect(() => {
    loadVendors();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The search is handled in useEffect when searchTerm changes
    // Just resetting the page here
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleOpenDetails = (vendorId) => {
    setSelectedVendorId(vendorId);
    setDetailsOpen(true);
  };

  // Bulk action handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(vendors.map((vendor) => vendor.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (event, id) => {
    if (event.target.checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((selectedId) => selectedId !== id));
    }
  };

  const handleBulkActionMenuOpen = (event) => {
    setActionMenuAnchor(event.currentTarget);
  };

  const handleBulkActionMenuClose = () => {
    setActionMenuAnchor(null);
  };

  const handleBulkApprove = async () => {
    setActionMenuAnchor(null);
    if (selected.length === 0) return;

    try {
      setLoading(true);
      console.log(`Bulk approving ${selected.length} vendors:`, selected);
      const promises = selected.map((id) => adminService.approveVendor(id));
      const results = await Promise.all(promises);
      console.log("Bulk approve results:", results);
      notify(`Successfully approved ${selected.length} vendors`, {
        type: "success",
      });
      setSelected([]);
      loadVendors();
    } catch (error) {
      console.error("Error bulk approving vendors:", error);
      notify(`Error: ${error.message || "Failed to perform bulk action"}`, {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSuspend = async () => {
    setActionMenuAnchor(null);
    if (selected.length === 0) return;

    try {
      setLoading(true);
      console.log(`Bulk suspending ${selected.length} vendors:`, selected);
      const promises = selected.map((id) => adminService.suspendVendor(id));
      const results = await Promise.all(promises);
      console.log("Bulk suspend results:", results);
      notify(`Successfully suspended ${selected.length} vendors`, {
        type: "success",
      });
      setSelected([]);
      loadVendors();
    } catch (error) {
      console.error("Error bulk suspending vendors:", error);
      notify(`Error: ${error.message || "Failed to perform bulk action"}`, {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false}>
      <Title title="Vendors Management" />

      {/* Add Statistics Panel */}
      {!loading && !error && vendors.length > 0 && (
        <VendorStatistics vendors={vendors} />
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <form onSubmit={handleSearch}>
                <Box display="flex">
                  <MuiTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Search by Business Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton type="submit" size="small">
                          <SearchIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
              </form>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status Filter"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="PENDING_APPROVAL">Pending Approval</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="SUSPENDED">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={5} sx={{ textAlign: "right" }}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={loadVendors}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                Refresh
              </Button>

              {selected.length > 0 && (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleBulkActionMenuOpen}
                  startIcon={<MoreVertIcon />}
                >
                  Bulk Actions ({selected.length})
                </Button>
              )}

              <Menu
                anchorEl={actionMenuAnchor}
                open={Boolean(actionMenuAnchor)}
                onClose={handleBulkActionMenuClose}
              >
                <MenuItem onClick={handleBulkApprove}>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Approve Selected</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleBulkSuspend}>
                  <ListItemIcon>
                    <RemoveCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Suspend Selected</ListItemText>
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error">{error}</Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadVendors}
              sx={{ mt: 1 }}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={
                          vendors.length > 0 &&
                          selected.length === vendors.length
                        }
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < vendors.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Business Name</TableCell>
                    <TableCell>Service Type</TableCell>
                    <TableCell>Vendor Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No vendors found
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.includes(vendor.id)}
                            onChange={(event) =>
                              handleSelectOne(event, vendor.id)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <BusinessNameField
                            record={vendor}
                            onBusinessInfoChange={loadVendors}
                          />
                        </TableCell>
                        <TableCell>{vendor.serviceType}</TableCell>
                        <TableCell>{vendor.name}</TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>
                          <VendorStatusField record={vendor} />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <ApproveButton
                              record={vendor}
                              onStatusChange={loadVendors}
                            />
                            <SuspendButton
                              record={vendor}
                              onStatusChange={loadVendors}
                            />
                            <BlockButton
                              record={vendor}
                              onBlockChange={loadVendors}
                            />
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDetails(vendor.id)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      <VendorDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        vendorId={selectedVendorId}
      />
    </Container>
  );
};

export default VendorListCustom;
