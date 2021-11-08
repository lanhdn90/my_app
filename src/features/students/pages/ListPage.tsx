import { Box, Button, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { StudentApi } from 'api/StudentApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectCityList, selectCityMap } from 'features/city/citySlice';
import { ListParams, Student } from 'models';
import React, { useEffect } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import StudentFilters from '../components/StudentFilters';
import StudentList from '../components/StudentList';
import { toast } from 'react-toastify';

import {
  selectStudentFilter,
  selectStudentList,
  selectStudentLoading,
  selectStudentPagination,
  studentActions
} from '../studentSlice';
const useStyles = makeStyles((theme) => ({
  root: { position: 'relative', paddingTop: theme.spacing(1) },
  titleContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  loading: {
    position: 'absolute',
    top: theme.spacing(-1),
    width: '100%',
  },
}));

export default function ListPage() {
  const match = useRouteMatch();
  const history = useHistory();
  const studentList = useAppSelector(selectStudentList);
  const pagination = useAppSelector(selectStudentPagination);
  const filter = useAppSelector(selectStudentFilter);
  const loading = useAppSelector(selectStudentLoading);
  const cityMap = useAppSelector(selectCityMap);
  const cityList = useAppSelector(selectCityList);
  const dispatch = useAppDispatch();

  const classes = useStyles();
  useEffect(() => {
    dispatch(studentActions.fetchStudentList(filter));
  }, [dispatch, filter]);

  const handlePageChange = (e: any, page: number) => {
    dispatch(
      dispatch(
        studentActions.setFilter({
          ...filter,
          _page: page,
        })
      )
    );
  };

  const handleSearchChange = (newFilter: ListParams) => {
    dispatch(studentActions.setFilterWithDebounce(newFilter));
  };

  const handleFilterChange = (newFilter: ListParams) => {
    dispatch(studentActions.setFilter(newFilter));
  };

  const handleRemoveStudent = async (student: Student) => {
    try {
      await StudentApi.remove(student?.id || '');
      const newFilter = { ...filter };
      dispatch(studentActions.setFilter(newFilter));
      toast.success('remove student successfully!')
    } catch (error) {
      console.log('Failed to fetch remove student  ', error);
    }
  };

  const handleEditStudent = (student: Student) => {
    history.push(`${match.url}/${student.id}`)
  };
  return (
    <Box className={classes.root}>
      {loading && <LinearProgress className={classes.loading} />}
      <Box className={classes.titleContainer}>
        <Typography variant="h4">Students</Typography>
        <Link
          to={`${match.path}/add`}
          style={{
            textDecoration: 'none',
          }}
        >
          <Button variant="contained" color="primary">
            Add new Student
          </Button>
        </Link>
      </Box>
      <Box mb={3}>
        <StudentFilters
          filter={filter}
          cityList={cityList}
          onChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />
      </Box>
      <StudentList
        studentList={studentList}
        cityMap={cityMap}
        onEdit={handleEditStudent}
        onRemove={handleRemoveStudent}
      />
      <Box my={2} display="flex" justifyContent="flex-end">
        <Pagination
          color="primary"
          count={Math.ceil(pagination?._totalRows / pagination?._limit)}
          page={pagination?._page}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}
