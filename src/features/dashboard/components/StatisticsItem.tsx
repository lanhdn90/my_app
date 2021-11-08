import { Box, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'row, nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
}));

export interface StatisticsProps {
  icon: React.ReactElement;
  label: string;
  value: string | number;
}

export default function StatisticsItem({ icon, label, value }: StatisticsProps) {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Box>{icon}</Box>
      <Box>
        <Typography align='right'>{value}</Typography>
        <Typography>{label}</Typography>
      </Box>
    </Paper>
  );
}
