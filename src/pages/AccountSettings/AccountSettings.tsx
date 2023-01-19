/** @jsxImportSource @emotion/react */
import React, { ChangeEvent, useRef, useState } from 'react';
import { Button, Divider, Grid, Paper, TextField } from '@mui/material';
import {
  accountSettings,
  accountSettingsPage,
  avatar,
  divider,
  uploadAvatarButton,
} from './styles';
import { UserAvatar } from '@components';
import { useAppDispatch } from '@store';
import {
  updatePassword,
  updateUserAttributes,
  userSelector,
} from '@store/slices/auth.slice';
import { LoadingButton } from '@mui/lab';
import z, { TypeOf } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { User } from '@interfaces/user.interface';
import { AmplifyErrorTypes } from '@constants/amplify-error-types';

const updateNameSchema = z.object({
  name: z.string().nonempty(),
});

const changePasswordSchema = z
  .object({
    oldPassword: z.string().nonempty('This field is required'),
    newPassword: z
      .string()
      .nonempty('This field is required')
      .min(8, 'Password should be at least 8 characters long'),
    confirmNewPassword: z
      .string()
      .nonempty('This field is required')
      .min(8, 'Password should be at least 8 characters long'),
  })
  .required()
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: 'Passwords do not match',
  });

type UpdateNameValues = TypeOf<typeof updateNameSchema>;
type ChangePassValues = TypeOf<typeof changePasswordSchema>;

function UpdateNameForm() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector(userSelector) as User;

  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdateNameValues>({
    resolver: zodResolver(updateNameSchema),
    mode: 'onChange',
    defaultValues: { name: user.name },
  });

  const handleSaveNameClick: SubmitHandler<UpdateNameValues> = async ({
    name,
  }) => {
    try {
      setLoading(true);
      await dispatch(updateUserAttributes({ name })).unwrap();
      setLoading(false);

      enqueueSnackbar('All changes saved!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    } catch (e) {
      setLoading(false);
      enqueueSnackbar(`Something went wrong. Server response: ${e.message}`, {
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Name"
          error={!!errors.name}
          {...register('name')}
        />
      </Grid>
      <Grid item xs={12}>
        <LoadingButton
          disabled={!!errors.name}
          loading={loading}
          variant="contained"
          disableElevation
          fullWidth
          onClick={handleSubmit(handleSaveNameClick)}
        >
          save name
        </LoadingButton>
      </Grid>
    </Grid>
  );
}

function ChangePasswordForm() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ChangePassValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const handleChangePasswordClick: SubmitHandler<ChangePassValues> = async ({
    oldPassword,
    newPassword,
  }) => {
    try {
      setLoading(true);
      await dispatch(updatePassword({ oldPassword, newPassword })).unwrap();
      setLoading(false);

      enqueueSnackbar('All changes saved!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    } catch (e) {
      setLoading(false);

      if (e.name === AmplifyErrorTypes.NotAuthorized) {
        enqueueSnackbar('Incorrect old password', {
          variant: 'error',
          autoHideDuration: 5000,
        });
      }

      if (e.name === AmplifyErrorTypes.InvalidParameter) {
        enqueueSnackbar(
          'Something went wrong. Make sure you filled the fields properly.',
          {
            variant: 'error',
            autoHideDuration: 5000,
          },
        );
      }
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          type="password"
          label="Old password"
          fullWidth
          error={!!errors.oldPassword}
          helperText={errors.oldPassword?.message}
          {...register('oldPassword')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="password"
          label="New password"
          fullWidth
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          {...register('newPassword')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="password"
          label="Confirm new password"
          fullWidth
          error={!!errors.confirmNewPassword}
          helperText={errors.confirmNewPassword?.message}
          {...register('confirmNewPassword')}
        />
      </Grid>
      <Grid item xs={12}>
        <LoadingButton
          loading={loading}
          variant="contained"
          disableElevation
          fullWidth
          onClick={handleSubmit(handleChangePasswordClick)}
        >
          update password
        </LoadingButton>
      </Grid>
    </Grid>
  );
}

function AccountSettings() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreviewSrc, setAvatarPreviewSrc] = useState<string>();

  const handleUploadAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setAvatarPreviewSrc(reader.result as string);
      });

      reader.readAsDataURL(file);
    }
  };

  return (
    <Grid container css={accountSettingsPage}>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={4} mx="auto">
        <Paper elevation={0} css={accountSettings}>
          <UserAvatar size={140} css={avatar} src={avatarPreviewSrc} />
          <Button
            variant="contained"
            disableElevation
            css={uploadAvatarButton}
            onClick={handleUploadAvatarClick}
          >
            change profile pic
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </Button>
          <Divider flexItem css={divider} />
          <UpdateNameForm />
          <Divider flexItem css={divider} />
          <ChangePasswordForm />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AccountSettings;
