import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  ShowButton,
  FilterButton,
  TopToolbar,
  SearchInput,
  TextInput,
  SelectInput,
  useRecordContext,
} from "react-admin";
import { Box, Typography, Alert, Chip } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Custom empty component with better UI
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
      No payments found
    </Typography>
    <Typography variant="body2" color="text.secondary">
      There are no payment records matching your criteria.
    </Typography>
  </Box>
);

// Custom error component
const Error = () => (
  <Box padding={2}>
    <Alert severity="error">
      An error occurred while loading payment data. Please try refreshing the
      page.
    </Alert>
  </Box>
);

// Custom status field with conditional coloring
const StatusField = (props) => {
  const record = useRecordContext();
  if (!record) return null;

  const status = record.status;
  let color = "default";

  if (status === "COMPLETED") color = "success";
  else if (status === "PENDING") color = "warning";
  else if (status === "FAILED") color = "error";

  return <Chip label={status} color={color} size="small" />;
};

// Payment filters
const paymentFilters = [
  <SearchInput source="q" alwaysOn />,
  <TextInput source="userName" label="Client Name" />,
  <SelectInput
    source="status"
    choices={[
      { id: "COMPLETED", name: "Completed" },
      { id: "PENDING", name: "Pending" },
      { id: "FAILED", name: "Failed" },
    ]}
  />,
];

// List actions with filter button
const ListActions = () => (
  <TopToolbar>
    <FilterButton />
  </TopToolbar>
);

const PaymentList = () => {
  return (
    <List
      filters={paymentFilters}
      actions={<ListActions />}
      empty={<Empty />}
      error={<Error />}
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source="userName" label="Client" />
        <TextField source="eventName" label="Event" />
        <NumberField
          source="amount"
          options={{ style: "currency", currency: "ETB" }}
        />
        <StatusField source="status" label="Status" />
        <TextField source="method" label="Payment Method" />
        <TextField source="txRef" label="Transaction Ref" />
        <DateField source="date" showTime />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export default PaymentList;
