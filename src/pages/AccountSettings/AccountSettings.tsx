/** @jsxImportSource @emotion/react */
import React from 'react';
import { Button, Divider, Grid, Paper, TextField } from '@mui/material';
import {
  accountSettings,
  accountSettingsPage,
  avatar,
  divider,
  uploadAvatarButton,
} from './styles';
import { UserAvatar } from '@components';

function AccountSettings() {
  return (
    <Grid container css={accountSettingsPage}>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={4} mx="auto">
        <Paper elevation={0} css={accountSettings}>
          <UserAvatar size={140} css={avatar} />
          <Button variant="contained" disableElevation css={uploadAvatarButton}>
            change profile pic
          </Button>
          <Divider flexItem css={divider} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Name" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" disableElevation fullWidth>
                save name
              </Button>
            </Grid>
          </Grid>
          <Divider flexItem css={divider} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Old password" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="New password" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Confirm new password" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" disableElevation fullWidth>
                update password
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AccountSettings;
