/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { authFormCard, authPage } from './styles';
import {
  Paper,
  Tabs,
  Tab,
  Grid,
  Box,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import z, { TypeOf } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login, signUp } from '@store/slices/auth.slice';
import { useAppDispatch } from '@store';

enum TabValue {
  SIGN_IN,
  SIGN_UP,
}

const signInSchema = z
  .object({
    email: z
      .string()
      .nonempty('Email is required')
      .email('Invalid email format'),
    password: z.string().nonempty('Password is required'),
  })
  .required();

const signUpSchema = z
  .object({
    name: z.string().nonempty('Name is required'),
    email: z
      .string()
      .nonempty('Email is required')
      .email('Invalid email format'),
    password: z.string().nonempty('Password is required'),
    confirmPassword: z.string().nonempty('Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type SignInValues = TypeOf<typeof signInSchema>;
type SignUpValues = TypeOf<typeof signUpSchema>;

function SignInForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });
  const dispatch = useAppDispatch();

  const onSubmitClick: SubmitHandler<SignInValues> = (values) => {
    // dispatch(login(values));
  };

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Log in into PhotoGallery</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email address"
          required
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ''}
          {...register('email')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Password"
          type="password"
          required
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
          {...register('password')}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          disableElevation
          fullWidth
          onClick={handleSubmit(onSubmitClick)}
        >
          Sign in
        </Button>
      </Grid>
    </Grid>
  );
}

function SignUpForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });
  const dispatch = useAppDispatch();

  const onSubmitClick: SubmitHandler<SignUpValues> = ({
    email,
    password,
    name,
  }) => {
    // dispatch(signUp({ email, name, password }));
  };

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Create new PhotoGallery account</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Name"
          required
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ''}
          {...register('name')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email address"
          required
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ''}
          {...register('email')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Password"
          type="password"
          required
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
          {...register('password')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          type="password"
          label="Confirm password"
          required
          error={!!errors.confirmPassword}
          helperText={
            errors.confirmPassword ? errors.confirmPassword.message : ''
          }
          {...register('confirmPassword')}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          disableElevation
          fullWidth
          onClick={handleSubmit(onSubmitClick)}
        >
          Sign up
        </Button>
      </Grid>
    </Grid>
  );
}

function Authentication() {
  const [tab, setTab] = useState<TabValue>(TabValue.SIGN_IN);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: TabValue) => {
    setTab(newValue);
  };

  return (
    <Grid css={authPage} container>
      <Grid item xs={12} sm={8} md={7} lg={6} xl={4}>
        <Paper css={authFormCard}>
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab value={TabValue.SIGN_IN} label="sign in" />
            <Tab value={TabValue.SIGN_UP} label="create new account" />
          </Tabs>
          <Box py={12} px={8}>
            {tab === TabValue.SIGN_IN ? <SignInForm /> : <SignUpForm />}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Authentication;
