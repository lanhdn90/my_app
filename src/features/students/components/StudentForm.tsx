import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useAppSelector } from 'app/hooks';
import { InputFields, RadioGroupField, SelectFiled } from 'components/FormFields';
import { selectCityOptions } from 'features/city/citySlice';
import { Student } from 'models';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
export interface StudentFormProps {
  initialValues?: Student;
  onSubmit?: (formValues: Student) => void;
}

const schema = yup
  .object({
    name: yup.string().required(),
    age: yup
      .number()
      .positive('Please enter a positive number')
      .min(18, 'Min is 18')
      .max(60, 'Max is 60')
      .integer('Please enter a integer')
      .required('Please enter age')
      .typeError('Please enter a valid number'),
    mark: yup
      .number()
      .min(0, 'Min is 0')
      .max(10, 'Max is 10')
      .required('Please enter mark')
      .typeError('Please enter a valid number'),
    gender: yup
      .string()
      .oneOf(['male', 'female'], 'Please select either male or female')
      .required('Please select gender'),
    city: yup.string().required('Please select city'),
  })
  .required();

export default function StudentForm({ initialValues, onSubmit }: StudentFormProps) {
  const [error, setError] = useState<string>('');
  const cityOptions = useAppSelector(selectCityOptions);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Student>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });
  const handleFormSubmit = async (formValues: Student) => {
    try {
      setError('');
      await onSubmit?.(formValues);
    } catch (error: any) {
      setError(error.message);
    }
  };
  return (
    <Box maxWidth={400}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <InputFields name="name" control={control} label="Full Name" />
        <RadioGroupField
          name="gender"
          control={control}
          label="Gender"
          option={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ]}
        />
        <InputFields name="age" control={control} label="Age" type="number" />
        <InputFields name="mark" control={control} label="Mark" type="number" />
        {Array.isArray(cityOptions) && cityOptions.length > 0 && (
          <SelectFiled name="city" control={control} label="City" options={cityOptions} />
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting && <CircularProgress size={16} color="primary" />}&nbsp;Save
          </Button>
        </Box>
      </form>
    </Box>
  );
}
