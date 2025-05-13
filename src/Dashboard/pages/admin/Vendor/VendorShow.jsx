import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  EmailField,
  DateField,
  BooleanField,
  useRecordContext,
  RichTextField,
  TabbedShowLayout,
  Tab,
  ArrayField,
  Datagrid,
  NumberField,
  EditButton,
  TopToolbar,
  Button,
  useRedirect,
} from "react-admin";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Paper,
  Avatar,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LinkIcon from "@mui/icons-material/Link";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

// Custom vendor header
const VendorHeader = () => {
  const record = useRecordContext();
  const redirect = useRedirect();

  if (!record) return null;

  return (
    <Box mb={3}>
      <Paper
        sx={{
          p: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          gap: 3,
        }}
        elevation={2}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: "primary.main",
            fontSize: "2.5rem",
          }}
        >
          {record.businessName?.[0]?.toUpperCase() || "V"}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="h5" component="h1">
              {record.businessName}
            </Typography>
            {record.isApproved ? (
              <Chip
                icon={<VerifiedIcon />}
                label="Approved"
                color="success"
                size="small"
              />
            ) : (
              <Chip label="Pending Approval" color="warning" size="small" />
            )}
          </Box>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            <BusinessIcon
              fontSize="small"
              sx={{ verticalAlign: "middle", mr: 1 }}
            />
            {record.category}
          </Typography>

          <Typography variant="body2" paragraph>
            <LocationOnIcon
              fontSize="small"
              sx={{ verticalAlign: "middle", mr: 1 }}
            />
            {record.address || "No address provided"}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <EmailIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", mr: 1 }}
                />
                {record.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <PhoneIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", mr: 1 }}
                />
                {record.phone}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <ReceiptLongIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", mr: 1 }}
                />
                TIN: {record.tinNumber || "Not provided"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignSelf: { xs: "stretch", sm: "flex-start" },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => redirect("edit", "vendor", record.id)}
          >
            Edit Vendor
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              redirect("list", "service", { filter: { vendor_id: record.id } })
            }
          >
            View Services
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

const VendorShow = () => {
  return (
    <Show title="Vendor Details" component="div" actions={false}>
      <>
        <VendorHeader />

        <TabbedShowLayout>
          <Tab label="Details">
            <Typography variant="h6" gutterBottom>
              Business Details
            </Typography>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Business Description
                  </Typography>
                  <RichTextField source="description" />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Additional Information
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Website
                      </Typography>
                      <Typography variant="body1">
                        {(record) => record.website || "Not provided"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Founded
                      </Typography>
                      <Typography variant="body1">
                        {(record) => record.foundingYear || "Not provided"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Registration Date
                      </Typography>
                      <DateField source="createdAt" showTime />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Primary Contact
                  </Typography>
                  <TextField source="contactPerson" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <EmailField source="email" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <TextField source="phone" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                  <TextField source="address" />
                </Grid>
              </Grid>
            </Paper>
          </Tab>

          <Tab label="Services" path="services">
            <ArrayField source="services">
              <Datagrid bulkActionButtons={false}>
                <TextField source="title" />
                <TextField source="category" />
                <NumberField
                  source="price"
                  options={{ style: "currency", currency: "ETB" }}
                />
                <DateField source="createdAt" />
                <BooleanField source="isAvailable" />
              </Datagrid>
            </ArrayField>
          </Tab>

          <Tab label="Bookings" path="bookings">
            <ArrayField source="bookings">
              <Datagrid bulkActionButtons={false}>
                <TextField source="clientName" />
                <TextField source="serviceName" />
                <DateField source="eventDate" />
                <TextField source="status" />
                <NumberField
                  source="amount"
                  options={{ style: "currency", currency: "ETB" }}
                />
              </Datagrid>
            </ArrayField>
          </Tab>
        </TabbedShowLayout>
      </>
    </Show>
  );
};

export default VendorShow;
