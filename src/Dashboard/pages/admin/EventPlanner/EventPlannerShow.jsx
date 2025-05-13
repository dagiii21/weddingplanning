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
  Rating,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

// Custom planner header
const PlannerHeader = () => {
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
            bgcolor: "secondary.main",
            fontSize: "2.5rem",
          }}
        >
          {(record.firstName?.[0] || "") + (record.lastName?.[0] || "")}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="h5" component="h1">
              {record.firstName} {record.lastName}
            </Typography>
            {record.isActive ? (
              <Chip
                icon={<VerifiedIcon />}
                label="Active"
                color="success"
                size="small"
              />
            ) : (
              <Chip label="Inactive" color="error" size="small" />
            )}
          </Box>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            <WorkIcon
              fontSize="small"
              sx={{ verticalAlign: "middle", mr: 1 }}
            />
            {record.specialization || "Wedding Planner"}
          </Typography>

          <Typography variant="body2" paragraph>
            <SchoolIcon
              fontSize="small"
              sx={{ verticalAlign: "middle", mr: 1 }}
            />
            {record.yearsOfExperience
              ? `${record.yearsOfExperience} years of experience`
              : "Experience not specified"}
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
                <CalendarTodayIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", mr: 1 }}
                />
                Joined: {new Date(record.createdAt).toLocaleDateString()}
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
            onClick={() => redirect("edit", "event-planner", record.id)}
          >
            Edit Planner
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

const EventPlannerShow = () => {
  return (
    <Show title="Event Planner Details" component="div" actions={false}>
      <>
        <PlannerHeader />

        <TabbedShowLayout>
          <Tab label="Details">
            <Typography variant="h6" gutterBottom>
              Professional Information
            </Typography>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Professional Bio
                  </Typography>
                  <RichTextField source="bio" />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Expertise Areas
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {(record) =>
                      (
                        record.expertiseAreas || [
                          "Wedding Planning",
                          "Event Coordination",
                        ]
                      ).map((area) => (
                        <Chip key={area} label={area} size="small" />
                      ))
                    }
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Performance & Rating
            </Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Events Managed
                  </Typography>
                  <Typography variant="h6">
                    {(record) => record.eventsCount || "0"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Rating
                      value={(record) => record.rating || 0}
                      readOnly
                      precision={0.5}
                    />
                    <Typography variant="body2" ml={1}>
                      ({(record) => record.reviewsCount || "0"} reviews)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Account Status
                  </Typography>
                  <BooleanField source="isActive" />
                </Grid>
              </Grid>
            </Paper>
          </Tab>

          <Tab label="Managed Events" path="events">
            <ArrayField source="managedEvents">
              <Datagrid bulkActionButtons={false}>
                <TextField source="title" />
                <TextField source="clientName" />
                <DateField source="eventDate" />
                <TextField source="status" />
                <NumberField
                  source="budget"
                  options={{ style: "currency", currency: "ETB" }}
                />
              </Datagrid>
            </ArrayField>
          </Tab>

          <Tab label="Account Info" path="account">
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Account Information
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <EmailField source="email" />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Phone Number
                      </Typography>
                      <TextField source="phone" />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Created At
                      </Typography>
                      <DateField source="createdAt" showTime />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <DateField source="updatedAt" showTime />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    System Information
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        User ID
                      </Typography>
                      <TextField source="id" />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Login
                      </Typography>
                      <DateField source="lastLogin" showTime />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Tab>
        </TabbedShowLayout>
      </>
    </Show>
  );
};

export default EventPlannerShow;
