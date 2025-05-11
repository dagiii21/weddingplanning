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

const statusChoices = [
  { id: 'APPROVED', name: 'Approved' },
  { id: 'SUSPENDED', name: 'Suspended' }
];

const EventPlannerEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput disabled source="id" />
           <TextInput source="name" validate={required()} />
           <TextInput source="email" validate={[required(), email()]} />
        <TextInput source="phone" type="tel" />
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

export default EventPlannerEdit;