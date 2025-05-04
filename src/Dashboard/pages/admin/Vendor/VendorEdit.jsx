import React from 'react';
import { 
  Edit, 
  SimpleForm, 
  TextInput, 
  BooleanInput, 
  DateInput, 
  SelectInput,
  email,
  required
} from 'react-admin';

const VendorEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="name" validate={required()} />
        <SelectInput source="serviceType" choices={[
          { id: 'venue', name: 'Venue' },
          { id: 'catering', name: 'Catering' },
          { id: 'photography', name: 'Photography' },
          { id: 'flowers', name: 'Flowers' },
          { id: 'music', name: 'Music' },
          { id: 'other', name: 'Other' },
        ]} validate={required()} label="Type" />
        <TextInput source="email" validate={[required(), email()]} />
        <TextInput source="phone" />
        <DateInput source="createdAt" disabled />
        <BooleanInput source="isActive" />
      </SimpleForm>
    </Edit>
  );
};

export default VendorEdit;