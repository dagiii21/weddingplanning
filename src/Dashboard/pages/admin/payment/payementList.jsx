import React from 'react';
import { 
  List,
  Datagrid,
  TextField
} from 'react-admin';


const payemntList = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="payement" />
        <TextField source="method" />
        <TextField source="amount" />
      </Datagrid>
    </List>
  );
};

export default payemntList;