import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  BooleanField,
  EditButton,
  ShowButton,
  FilterButton,
  SearchInput,
  TextInput,
  SelectInput,
  BooleanInput,
  TopToolbar,
  ExportButton,
  ChipField,
} from "react-admin";
import { Box, Typography, Chip, Alert } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// Custom empty component
const Empty = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    padding={4}
    gap={2}
  >
    <ErrorOutlineIcon sx={{ fontSize: 60, color: "text.secondary" }} />
    <Typography variant="h6" color="text.secondary">
      No vendors found
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Try adjusting your search filters or add a new vendor.
    </Typography>
  </Box>
);

// Custom error component
const Error = () => (
  <Box padding={2}>
    <Alert severity="error">
      An error occurred while loading vendor data. Please try refreshing the
      page.
    </Alert>
  </Box>
);

// Status field with colored chips
const ApprovalStatusField = ({ record }) => {
  if (!record || !record.isApproved) return null;

  return record.isApproved ? (
    <Chip
      icon={<CheckCircleIcon />}
      label="Approved"
      color="success"
      size="small"
    />
  ) : (
    <Chip icon={<CancelIcon />} label="Pending" color="warning" size="small" />
  );
};

// Vendor filters
const vendorFilters = [
  <SearchInput source="q" alwaysOn />,
  <TextInput source="businessName" label="Business Name" />,
  <TextInput source="email" label="Email" />,
  <SelectInput
    source="category"
    choices={[
      { id: "catering", name: "Catering" },
      { id: "venue", name: "Venue" },
      { id: "photography", name: "Photography" },
      { id: "decoration", name: "Decoration" },
      { id: "music", name: "Music" },
    ]}
  />,
  <BooleanInput source="isApproved" label="Approved Status" />,
];

// List actions
const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

const VendorList = () => {
  return (
    <List
      filters={vendorFilters}
      actions={<ListActions />}
      empty={<Empty />}
      error={<Error />}
    >
      <Datagrid>
        <TextField source="businessName" label="Business Name" />
        <TextField source="category" label="Category" />
        <EmailField source="email" />
        <TextField source="phone" />
        <TextField source="tinNumber" label="TIN Number" />
        <ApprovalStatusField source="isApproved" label="Status" />
        <DateField source="createdAt" label="Registered On" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export default VendorList;
