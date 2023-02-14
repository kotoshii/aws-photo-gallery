/** @jsxImportSource @emotion/react */
import React from 'react';
import { Box, Popover } from '@mui/material';
import { ProfileMenu, UserAvatar } from '@components';
import { avatar, avatarWrapper, popover } from './styles';

function ExpandableAvatarProfile() {
  const [profileMenuAnchor, setProfileMenuAnchor] =
    React.useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  return (
    <>
      <Box onClick={handleAvatarClick} css={avatarWrapper}>
        <UserAvatar css={avatar} />
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
        <ProfileMenu handleProfileMenuClose={handleProfileMenuClose} />
      </Popover>
    </>
  );
}

export default ExpandableAvatarProfile;
