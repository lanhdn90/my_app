import { Box, Typography } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import { StudentApi } from 'api/StudentApi';
import { Student } from 'models';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import StudentForm from '../components/StudentForm';
export default function AddEditPage() {
  const history = useHistory()
  const { studentId } = useParams<{ studentId: string }>();
  const isEdit = Boolean(studentId);
  const [student, setStudent] = useState<Student>();

  useEffect(() => {
    if (!studentId) return;
    //IFFE
    (async () => {
      try {
        const data = await StudentApi.getById(studentId);
        setStudent(data);
      } catch (error) {
        console.log('Failed to fetch student details', error);
      }
    })();
  }, [studentId]);

  const handleStudentFormSubmit = async (formValues: Student) => {
    if(isEdit){
      await StudentApi.update(formValues)
    }else{
      await StudentApi.add(formValues)
    }
    const message = isEdit
    toast.success('Save student successfully!')
    // throw new Error('my test error')
    history.push('/admin/students')
  };
  const initialValues: Student = {
    name: '',
    age: '',
    mark: '',
    gender: 'male',
    city: '',
    ...student,
  } as Student;
  return (
    <Box>
      <Link
        to="/admin/students"
        style={{
          textDecoration: 'none',
        }}
      >
        <Typography
          variant="caption"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeft /> Back to student list
        </Typography>
      </Link>
      <Typography variant="h4">{isEdit ? 'Update student info' : 'Add new student'}</Typography>
      {(!isEdit || Boolean(student)) && (
        <Box mt={3}>
          <StudentForm initialValues={initialValues} onSubmit={handleStudentFormSubmit} />
        </Box>
      )}
    </Box>
  );
}
