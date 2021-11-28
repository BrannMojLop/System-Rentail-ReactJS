import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export  function BasicAlerts(props) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity={props.resSeverity}>
        {props.responseMessage}
      </Alert>
    </Stack>
  );
}
