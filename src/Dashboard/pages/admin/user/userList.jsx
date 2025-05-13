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
import BlockIcon from "@mui/icons-material/Block";

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
      No users found
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Try adjusting your search filters or add a new user.
    </Typography>
  </Box>
);

// Custom error component
const Error = () => (
  <Box padding={2}>
    <Alert severity="error">
      An error occurred while loading user data. Please try refreshing the page.
    </Alert>
  </Box>
);

// Status field with colored chips
const StatusField = ({ record }) => {
  if (!record) return null;

  return record.isActive ? (
    <Chip
      icon={<CheckCircleIcon />}
      label="Active"
      color="success"
      size="small"
    />
  ) : (
    <Chip icon={<BlockIcon />} label="Blocked" color="error" size="small" />
  );
};

// User filters
const userFilters = [
  <SearchInput source="q" alwaysOn />,
  <TextInput source="name" label="Name" />,
  <TextInput source="email" label="Email" />,
  <BooleanInput source="isActive" label="Active Status" />,
];

// List actions
const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

const UserList = () => {
  return (
    <List
      filters={userFilters}
      actions={<ListActions />}
      empty={<Empty />}
      error={<Error />}
    >
      <Datagrid>
        <TextField source="firstName" label="First Name" />
        <TextField source="lastName" label="Last Name" />
        <EmailField source="email" />
        <TextField source="phone" label="Phone Number" />
        <StatusField source="isActive" label="Status" />
        <DateField source="createdAt" label="Registered On" />
        <TextField source="lastLogin" label="Last Login" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export default UserList;
