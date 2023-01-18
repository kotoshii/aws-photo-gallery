import React from 'react';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { userSelector } from '@store/slices/auth.slice';
import { User } from '@interfaces/user.interface';

interface UserAvatarProps {
  className?: string;
}

function UserAvatar({ className }: UserAvatarProps) {
  const user = useSelector(userSelector) as User;
  return <Avatar alt={user.name} className={className} />;
}

export default UserAvatar;
