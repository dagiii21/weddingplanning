import React, { useState, useEffect } from "react";
import {
  TextField,
  EmailField,
  DateField,
  BooleanField,
  EditButton,
  ShowButton,
  useRecordContext,
  useNotify,
  useRefresh,
  SelectInput,
  TextInput,
  Filter,
  FunctionField,
  Confirm,
  Title,
} from "react-admin";
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
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Stack,
  Divider,
  Container,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import ReportIcon from "@mui/icons-material/Report";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import { eventPlannerService } from "../../../../services/api";
import { API_BASE_URL } from "../../../../config/env";

// Filter component for searching vendors
const VendorFilter = (props) => (
  <Filter {...props}>
    <TextInput
      label="Search Business Name"
      source="businessName_like"
      alwaysOn
    />
    <TextInput label="Search Service Type" source="serviceType_like" />
    <SelectInput
      label="Status"
      source="status"
      choices={[
        { id: "PENDING_APPROVAL", name: "Pending Approval" },
        { id: "APPROVED", name: "Approved" },
        { id: "SUSPENDED", name: "Suspended" },
      ]}
    />
  </Filter>
);

// Status component that allows changing the vendor status
const VendorStatusField = ({ record, onStatusChange }) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  if (!record) return null;

  const handleStatusChange = async () => {
    try {
      await eventPlannerService.updateVendorStatus(record.id, newStatus);
      notify(`Vendor status updated to ${newStatus}`, { type: "success" });
      if (onStatusChange) onStatusChange();
      setConfirmOpen(false);
    } catch (error) {
      notify(`Error: ${error.message || "Failed to update status"}`, {
        type: "error",
      });
    }
  };

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
    <>
      <Chip
        label={record.status}
        color={getStatusColor(record.status)}
        variant="outlined"
        onClick={() => setConfirmOpen(true)}
        size="small"
        sx={{ cursor: "pointer" }}
      />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Change Vendor Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus || record.status}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="PENDING_APPROVAL">Pending Approval</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="SUSPENDED">Suspended</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusChange} color="primary">
            Update Status
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

  if (!record) return null;

  const handleBlock = async () => {
    try {
      await eventPlannerService.toggleVendorBlock(record.id, !record.isBlocked);
      notify(
        record.isBlocked
          ? "Vendor has been unblocked"
          : "Vendor has been blocked",
        { type: "success" }
      );
      if (onBlockChange) onBlockChange();
      setConfirmOpen(false);
    } catch (error) {
      notify(`Error: ${error.message || "Operation failed"}`, {
        type: "error",
      });
    }
  };

  return (
    <>
      <Tooltip title={record.isBlocked ? "Unblock Vendor" : "Block Vendor"}>
        <IconButton
          onClick={() => setConfirmOpen(true)}
          color={record.isBlocked ? "warning" : "default"}
          size="small"
        >
          <BlockIcon />
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
          <Button onClick={handleBlock} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Report button component
const ReportButton = ({ record, onReportChange }) => {
  const notify = useNotify();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");

  if (!record) return null;

  const handleReport = async () => {
    if (!reason.trim()) {
      notify("Please provide a reason for reporting", { type: "warning" });
      return;
    }

    try {
      await eventPlannerService.reportVendor(record.id, reason);
      notify("Vendor has been reported", { type: "success" });
      if (onReportChange) onReportChange();
      setDialogOpen(false);
      setReason("");
    } catch (error) {
      notify(`Error: ${error.message || "Failed to report vendor"}`, {
        type: "error",
      });
    }
  };

  return (
    <>
      <Tooltip title="Report Vendor">
        <IconButton
          onClick={() => setDialogOpen(true)}
          color={record.isReported ? "error" : "default"}
          disabled={record.isReported}
          size="small"
        >
          <ReportIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Report Vendor</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph sx={{ mt: 1 }}>
            Please provide a reason for reporting this vendor.
          </Typography>
          <MuiTextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            multiline
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleReport} color="primary">
            Report
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
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState("");

  if (!record) return null;

  const handleEdit = async () => {
    const updateData = {};
    if (businessName.trim()) updateData.businessName = businessName;
    if (description.trim()) updateData.description = description;
    if (serviceType.trim()) updateData.serviceType = serviceType;

    if (Object.keys(updateData).length === 0) {
      notify("No changes to update", { type: "warning" });
      return;
    }

    try {
      await eventPlannerService.updateVendor(record.id, updateData);
      notify("Vendor information updated successfully", { type: "success" });
      if (onBusinessInfoChange) onBusinessInfoChange();
      setDialogOpen(false);
    } catch (error) {
      notify(`Error: ${error.message || "Failed to update vendor"}`, {
        type: "error",
      });
    }
  };

  const openEditDialog = () => {
    setBusinessName(record.businessName || "");
    setDescription(record.description || "");
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
            sx={{ mb: 2 }}
          />
          <MuiTextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} color="primary">
            Save Changes
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

  useEffect(() => {
    if (vendorId && open) {
      setLoading(true);
      fetch(`${API_BASE_URL}/eventplanner/vendors/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch vendor details");
          }
          return response.json();
        })
        .then((data) => {
          setVendor(data.data || data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching vendor:", err);
          setError(err.message || "Error loading vendor details");
          setLoading(false);
        });
    }
  }, [vendorId, open]);

  if (!open) return null;

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
          <Typography color="error">{error}</Typography>
        ) : vendor ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {vendor.businessName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {vendor.description}
                  </Typography>
                  <Chip
                    label={vendor.status}
                    color={
                      vendor.status === "APPROVED"
                        ? "success"
                        : vendor.status === "PENDING_APPROVAL"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  {vendor.user?.isBlocked && (
                    <Chip
                      label="Blocked"
                      color="error"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Contact Information
                  </Typography>
                  <Typography variant="body2">
                    Name: {vendor.user?.firstName} {vendor.user?.lastName}
                  </Typography>
                  <Typography variant="body2">
                    Email: {vendor.user?.email}
                  </Typography>
                  {vendor.user?.phone && (
                    <Typography variant="body2">
                      Phone: {vendor.user?.phone}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Services ({vendor.services?.length || 0})
                  </Typography>
                  {vendor.services?.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Service Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell>Category</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {vendor.services.map((service) => (
                            <TableRow key={service.id}>
                              <TableCell>{service.name}</TableCell>
                              <TableCell>{service.description}</TableCell>
                              <TableCell align="right">
                                ETB {service.price?.toLocaleString()}
                              </TableCell>
                              <TableCell>{service.category}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="textSecondary">
                      No services available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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

// Custom VendorList component without using React Admin's List
const VendorListOne = () => {
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
  const notify = useNotify();

  // Load vendors from the API
  const loadVendors = async () => {
    setLoading(true);
    try {
      const start = page * rowsPerPage;
      const end = start + rowsPerPage;

      // Build query parameters
      let queryParams = `_start=${start}&_end=${end}&_sort=createdAt&_order=DESC`;

      if (searchTerm) {
        queryParams += `&businessName_like=${encodeURIComponent(searchTerm)}`;
      }

      if (statusFilter) {
        queryParams += `&status=${encodeURIComponent(statusFilter)}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/eventplanner/vendors?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }

      const data = await response.json();
      setVendors(data);

      // Get total count from headers
      const totalCount = response.headers.get("x-total-count");
      if (totalCount) {
        setTotal(parseInt(totalCount, 10));
      }

      setError(null);
    } catch (err) {
      console.error("Error loading vendors:", err);
      setError(err.message || "Failed to load vendors");
      notify(`Error: ${err.message || "Failed to load vendors"}`, {
        type: "error",
      });
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

  return (
    <Container maxWidth={false}>
      <Title title="Vendors" />

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
              >
                Refresh
              </Button>
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
                      <TableCell colSpan={6} align="center">
                        No vendors found
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <BusinessNameField
                            record={vendor}
                            onBusinessInfoChange={loadVendors}
                          />
                        </TableCell>
                        <TableCell>{vendor.serviceType}</TableCell>
                        <TableCell>
                          {vendor.firstName} {vendor.lastName}
                        </TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>
                          <VendorStatusField
                            record={vendor}
                            onStatusChange={loadVendors}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <BlockButton
                              record={vendor}
                              onBlockChange={loadVendors}
                            />
                            <ReportButton
                              record={vendor}
                              onReportChange={loadVendors}
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

export default VendorListOne;
