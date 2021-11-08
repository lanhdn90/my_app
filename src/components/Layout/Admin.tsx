import { Box, makeStyles } from '@material-ui/core';
import Dashboard from 'features/dashboard';
import Students from 'features/students';
import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Header, Sidebar } from '../Common';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridTemplateColumns: '240px 1fr',
    gridTemplateAreas: `'header header' 'sidebar main'`,

    minHeight: '100vh',
  },
  header: {
    gridArea: 'header',
  },
  sidebar: {
    gridArea: 'sidebar',
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  main: {
    gridArea: 'main',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 3),
  },
}));

export function AdminLayout() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Header />
      </Box>
      <Box className={classes.sidebar}>
        <Sidebar />
      </Box>
      <Box className={classes.main}>
        <Switch>
          <Route path='/admin/dashboard'>
            <Dashboard/>
          </Route>
          <Route path='/admin/students'>
            <Students/>
          </Route>

        </Switch>
      </Box>
    </Box>
  );
}
