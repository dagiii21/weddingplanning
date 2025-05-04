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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import useVendorServices from "../../../../hooks/useVendorServices";

const SERVICE_CATEGORIES = ["Bronze", "Silver", "Gold", "Platinum"];

// Helper function to get category color
const getCategoryColor = (category) => {
  switch (category) {
    case "Bronze":
      return "default";
    case "Silver":
      return "secondary";
    case "Gold":
      return "warning";
    case "Platinum":
      return "primary";
    default:
      return "default";
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
    price: "",
    category: "",
  });

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleOpen = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        price: service.price.toString(),
        category: service.category,
      });
    } else {
      setEditingService(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
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
                <Typography variant="h6" color="primary">
                  ETB {service.price.toLocaleString()}
                </Typography>
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

      {/* Service Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingService ? "Edit Service" : "Add New Service"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
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
            <TextField
              fullWidth
              label="Price (ETB)"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              margin="normal"
              required
            >
              {SERVICE_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingService ? "Update" : "Add"} Service
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the service "
            {serviceToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceList;
