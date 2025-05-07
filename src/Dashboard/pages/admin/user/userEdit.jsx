import React from 'react';
import { 
  Edit, 
  SimpleForm, 
  TextInput, 
  BooleanInput, 
  DateInput, 
  SelectInput,
  email,
  required,
  useRecordContext
} from 'react-admin';

const userEdit = () => {
  const record = useRecordContext();
  
  const transform = (data) => {
    // Only include isBlocked in the request, remove isActive if it exists
    const { isActive, ...rest } = data;
    return rest;
  };

  return (
    <Edit transform={transform}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput 
          source="firstName" 
          validate={required()} 
          label="First Name"
        />
        <TextInput 
          source="lastName" 
          validate={required()} 
          label="Last Name"
        />
        <TextInput source="email" validate={[required(), email()]} />
        <TextInput source="phone" />
        <BooleanInput source="isBlocked" label="Block User" />
      </SimpleForm>
    </Edit>
  );
};

export default userEdit;