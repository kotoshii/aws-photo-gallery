/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  Avatar,
  CircularProgress,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from '@mui/material';
import { User } from '@interfaces/user.interface';
import { divider, menuList, profileMenu, profileMenuAvatar } from './styles';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@store';
import { loadingSelector, signOut } from '@store/slices/auth.slice';
import { AppRoutes } from '@constants/app-routes';
import { useSelector } from 'react-redux';

interface ProfileMenuProps {
  user: User;
}

function ProfileMenu({ user }: ProfileMenuProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loading = useSelector(loadingSelector);

  const handleLogOutClick = () => {
    dispatch(signOut());
  };

  const handleAccountSettingsClick = () => {
    navigate(AppRoutes.AccountSettings);
  };

  return (
    <Paper css={profileMenu} elevation={0}>
      <Avatar alt={user?.name} css={profileMenuAvatar} />
      <Typography variant="h5" mt={3}>
        {user?.name}
      </Typography>
      <Typography variant="caption" mt={0.5}>
        {user?.email}
      </Typography>
      <Divider css={divider} />
      <MenuList css={menuList}>
        <MenuItem onClick={handleAccountSettingsClick}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText>Account settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogOutClick}>
          <ListItemIcon>
            {loading ? (
              <CircularProgress color="inherit" size={22} />
            ) : (
              <LogoutIcon />
            )}
          </ListItemIcon>
          <ListItemText>Log out</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}

export default ProfileMenu;
