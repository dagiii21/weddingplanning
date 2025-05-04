import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useVendorServices from "../../../../hooks/useVendorServices";

const SERVICE_CATEGORIES = ["Bronze", "Silver", "Gold", "Platinum"];

const ServiceCreate = () => {
  const navigate = useNavigate();
  const { addService } = useVendorServices();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
      };
      await addService(serviceData);
      navigate("/Mangeservices"); // Navigate back to service list
    } catch (err) {
      console.error("Failed to create service:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" component="h1" gutterBottom>
        Add New Service
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                onClick={() => navigate("/Mangeservices")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Create Service"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ServiceCreate;
