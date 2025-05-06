import React from 'react';
import { 
  List, 
  Datagrid, 
  TextField, 
  EmailField, 
  DateField, 
  BooleanField,
  EditButton,
  ShowButton
} from 'react-admin';

const userList = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="name" label="Name" />
        <EmailField source="email" />
        <TextField source="phone" label="Phone Number" />
        <TextField 
          source="isActive" 
          label="Status"
          render={record => record.isActive ? 'Active' : 'Blocked'}
        />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export default userList;