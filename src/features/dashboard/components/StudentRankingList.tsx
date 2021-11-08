import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Student } from 'models';

const useStyles = makeStyles({
  table: {},
});

export interface StudentRankingListProps {
  studentList: Student[];
}

export default function StudentRankingList({ studentList }: StudentRankingListProps) {
  const classes = useStyles();

  return (
    <TableContainer>
      <Table className={classes.table} size='small' aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">#</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Mark</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studentList.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell align='center'>{index + 1}</TableCell>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="right">{row.mark}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
