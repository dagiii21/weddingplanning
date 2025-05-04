import React from 'react';
import { 
  Edit, 
  SimpleForm, 
  TextInput, 
  BooleanInput, 
  DateInput, 
  email,
  required
} from 'react-admin';

const EventPlannerEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="firstName" validate={required()} />
        <TextInput source="lastName" validate={required()} />
        <TextInput source="email" validate={[required(), email()]} />
        <TextInput source="phone" type='tel' validate={[required()]} />
        {/* If your backend has a serviceType for event planners, add this: */}
        {/* <SelectInput source="serviceType" choices={[ ... ]} label="Type" /> */}
      </SimpleForm>
    </Edit>
  );
};

export default EventPlannerEdit;