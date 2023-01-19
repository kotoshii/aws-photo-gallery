import React from 'react';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { userSelector } from '@store/slices/auth.slice';
import { User } from '@interfaces/user.interface';

interface UserAvatarProps {
  className?: string;
  size?: number | string;
  src?: string;
}

function UserAvatar({ className, size, src }: UserAvatarProps) {
  const user = useSelector(userSelector) as User;
  return (
    <Avatar
      src={src}
      alt={user.name}
      className={className}
      sx={{ width: size, height: size }}
    />
  );
}

export default UserAvatar;
