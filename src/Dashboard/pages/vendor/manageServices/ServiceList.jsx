import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Delete as RemoveIcon,
} from "@mui/icons-material";
import useVendorServices from "../../../../hooks/useVendorServices";

// Define service categories
const SERVICE_CATEGORIES = ["Wedding", "Birthday", "Corporate", "Other"];

// Define service tiers
const SERVICE_TIERS = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

// Helper function to get category color
const getCategoryColor = (category) => {
  switch (category) {
    case "Wedding":
      return "primary";
    case "Birthday":
      return "secondary";
    case "Corporate":
      return "warning";
    case "Other":
      return "default";
    default:
      return "default";
  }
};

// Helper function to get tier color
const getTierColor = (tier) => {
  switch (tier) {
    case "BRONZE":
      return "#cd7f32"; // Bronze color
    case "SILVER":
      return "#c0c0c0"; // Silver color
    case "GOLD":
      return "#ffd700"; // Gold color
    case "PLATINUM":
      return "#e5e4e2"; // Platinum color
    default:
      return "#4caf50"; // Default green
  }
};

const ServiceList = () => {
  const {
    services,
    loading,
    error,
    fetchServices,
    addService,
    updateService,
    deleteService,
  } = useVendorServices();

  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    basePrice: "",
    category: "",
    tiers: [
      { tier: "BRONZE", price: "", description: "Basic package" },
      { tier: "SILVER", price: "", description: "Standard package" },
      { tier: "GOLD", price: "", description: "Premium package" },
      { tier: "PLATINUM", price: "", description: "Ultimate package" },
    ],
  });

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleOpen = (service = null) => {
    if (service) {
      // For editing - if tiers aren't available yet, create default ones
      const serviceTiers =
        service.tiers && service.tiers.length > 0
          ? service.tiers
          : SERVICE_TIERS.map((tier, index) => ({
              tier,
              price: service.basePrice + index * 1000, // Simple default pricing
              description: `${
                tier.charAt(0) + tier.slice(1).toLowerCase()
              } package`,
            }));

      setFormData({
        title: service.title,
        description: service.description,
        basePrice: service.basePrice.toString(),
        category: service.category,
        tiers: serviceTiers,
      });
      setEditingService(service);
    } else {
      // For adding new service
      setFormData({
        title: "",
        description: "",
        basePrice: "",
        category: "",
        tiers: [
          { tier: "BRONZE", price: "", description: "Basic package" },
          { tier: "SILVER", price: "", description: "Standard package" },
          { tier: "GOLD", price: "", description: "Premium package" },
          { tier: "PLATINUM", price: "", description: "Ultimate package" },
        ],
      });
      setEditingService(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: "",
      description: "",
      basePrice: "",
      category: "",
      tiers: [
        { tier: "BRONZE", price: "", description: "Basic package" },
        { tier: "SILVER", price: "", description: "Standard package" },
        { tier: "GOLD", price: "", description: "Premium package" },
        { tier: "PLATINUM", price: "", description: "Ultimate package" },
      ],
    });
    setEditingService(null);
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (serviceToDelete) {
      try {
        await deleteService(serviceToDelete.serviceId);
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
      } catch (err) {
        console.error("Failed to delete service:", err);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  const handleUpdateTierField = (index, field, value) => {
    const updatedTiers = [...formData.tiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setFormData({ ...formData, tiers: updatedTiers });
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.title || !formData.basePrice || !formData.category) {
      return false;
    }

    // Validate each tier has a price
    if (
      !formData.tiers.every((tier) => tier.price && parseFloat(tier.price) > 0)
    ) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert(
        "Please fill in all required fields and ensure all tiers have valid prices."
      );
      return;
    }

    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        category: formData.category,
        tiers: formData.tiers.map((tier) => ({
          tier: tier.tier,
          price: parseFloat(tier.price),
          description: tier.description,
        })),
      };

      if (editingService) {
        await updateService(editingService.serviceId, serviceData);
      } else {
        await addService(serviceData);
      }
      handleClose();
    } catch (err) {
      console.error("Failed to save service:", err);
    }
  };

  if (loading && !services.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" component="h1">
          Manage Services
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add New Service
        </Button>
      </Box>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.serviceId}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="h6" gutterBottom>
                    {service.title}
                  </Typography>
                  <Chip
                    label={service.category}
                    color={getCategoryColor(service.category)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" paragraph>
                  {service.description}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Base Price: ETB {service.basePrice.toLocaleString()}
                </Typography>

                {/* Display service tiers */}
                {service.tiers && service.tiers.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Available Packages:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {service.tiers.map((tier) => (
                        <Chip
                          key={tier.id}
                          label={`${
                            tier.tier.charAt(0) +
                            tier.tier.slice(1).toLowerCase()
                          }: ETB ${tier.price.toLocaleString()}`}
                          size="small"
                          style={{
                            backgroundColor: getTierColor(tier.tier),
                            color:
                              tier.tier === "PLATINUM" || tier.tier === "SILVER"
                                ? "#000"
                                : "#fff",
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpen(service)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(service)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{serviceToDelete?.title}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingService ? "Edit Service" : "Add New Service"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Base Price (ETB)"
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">ETB</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    {SERVICE_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Service Packages
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Define pricing and features for each package tier. Clients will
                select one of these when booking.
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Package Tier</TableCell>
                      <TableCell>Price (ETB)</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.tiers.map((tier, index) => (
                      <TableRow key={tier.tier}>
                        <TableCell>
                          <Chip
                            label={
                              tier.tier.charAt(0) +
                              tier.tier.slice(1).toLowerCase()
                            }
                            style={{
                              backgroundColor: getTierColor(tier.tier),
                              color:
                                tier.tier === "PLATINUM" ||
                                tier.tier === "SILVER"
                                  ? "#000"
                                  : "#fff",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={tier.price}
                            onChange={(e) =>
                              handleUpdateTierField(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            required
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  ETB
                                </InputAdornment>
                              ),
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={tier.description}
                            onChange={(e) =>
                              handleUpdateTierField(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            fullWidth
                            placeholder="Describe what's included in this package"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <FormHelperText>
                All package tiers must have a valid price. Bronze should be the
                most basic package, while Platinum should be the premium
                offering.
              </FormHelperText>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!validateForm()}
            >
              {editingService ? "Update" : "Add"} Service
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ServiceList;
