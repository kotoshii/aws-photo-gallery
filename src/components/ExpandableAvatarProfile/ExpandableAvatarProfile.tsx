/** @jsxImportSource @emotion/react */
import React from 'react';
import { Avatar, Box, Popover } from '@mui/material';
import { ProfileMenu } from '@components';
import { avatar, avatarWrapper, popover } from './styles';
import { useSelector } from 'react-redux';
import { userSelector } from '@store/slices/auth.slice';
import { User } from '@interfaces/user.interface';

function ExpandableAvatarProfile() {
  const [profileMenuAnchor, setProfileMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const user = useSelector(userSelector) as User;

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  return (
    <>
      <Box onClick={handleAvatarClick} css={avatarWrapper}>
        <Avatar alt={user?.name} css={avatar} />
      </Box>
      <Popover
        css={popover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorEl={profileMenuAnchor}
        open={!!profileMenuAnchor}
        onClose={handleProfileMenuClose}
        elevation={0}
      >
        <ProfileMenu
          user={user}
          handleProfileMenuClose={handleProfileMenuClose}
        />
      </Popover>
    </>
  );
}

export default ExpandableAvatarProfile;
