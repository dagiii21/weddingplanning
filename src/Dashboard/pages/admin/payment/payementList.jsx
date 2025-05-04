import React from 'react';
import { 
  List,
  Datagrid,
  TextField,
  DateField
} from 'react-admin';

const payemntList = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="userName" label="Client" />
        <TextField source="eventName" label="Event" />
        <TextField source="amount" />
        <TextField source="status" />
        <TextField source="method" label="Payment Method" />
        <DateField source="date" />
      </Datagrid>
    </List>
  );
};

export default payemntList;