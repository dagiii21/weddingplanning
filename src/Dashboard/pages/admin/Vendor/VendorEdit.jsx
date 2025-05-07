import React from 'react';
import { 
  Edit, 
  SimpleForm, 
  TextInput, 
  DateInput, 
  SelectInput,
  email,
  required
} from 'react-admin';

const serviceTypes = [
  { id: 'CATERING', name: 'Catering' },
  { id: 'VENUE', name: 'Venue' },
  { id: 'PHOTOGRAPHY', name: 'Photography' },
  { id: 'MUSIC', name: 'Music' },
  { id: 'FLOWERS', name: 'Flowers' },
  { id: 'CAKE', name: 'Cake' },
  { id: 'ATTIRE', name: 'Attire' },
  { id: 'OTHER', name: 'Other' }
];

const statusChoices = [
  { id: 'APPROVED', name: 'Approved' },
  { id: 'SUSPENDED', name: 'Suspended' }
];

const VendorEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="name" validate={required()} />
        <TextInput source="email" validate={[required(), email()]} />
        <TextInput source="phone" type="tel" />
        <TextInput source="businessName" label="Business Name" />
        <SelectInput 
          source="serviceType" 
          choices={serviceTypes}
          label="Service Type"
        />
        <DateInput source="createdAt" disabled />
        <SelectInput 
          source="status" 
          choices={statusChoices}
          label="Account Status"
        />
      </SimpleForm>
    </Edit>
  );
};

export default VendorEdit;