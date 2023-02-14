/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { authFormCard, authPage, offlineAlert, offlineButton } from './styles';
import {
  Paper,
  Tabs,
  Tab,
  Grid,
  Box,
  TextField,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import z, { TypeOf } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  loadingSelector,
  login,
  setVerificationUsername,
  signUp,
  verifyAccount,
} from '@store/slices/auth.slice';
import { useAppDispatch } from '@store';
import { ArrowBackOutlined, CloudOff } from '@mui/icons-material';
import { AmplifyErrorTypes } from '@constants/amplify-error-types';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '@constants/app-routes';
import { setOfflineMode } from '@store/slices/common.slice';
import { resetFilesState } from '@store/slices/files.slice';
import { OfflineAlert } from '@components';

enum TabValue {
  SignIn,
  SignUp,
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
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password should be at least 8 characters long'),
    confirmPassword: z.string().nonempty('Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const verifyFormSchema = z.object({
  verificationCode: z.string().nonempty('Verification code is required'),
});

type SignInValues = TypeOf<typeof signInSchema>;
type SignUpValues = TypeOf<typeof signUpSchema>;
type VerifyValues = TypeOf<typeof verifyFormSchema>;

interface FormProps {
  setNeedsConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setTab?: React.Dispatch<React.SetStateAction<TabValue>>;
}

function SignInForm({ setNeedsConfirmation }: FormProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const loading = useSelector(loadingSelector);

  const onSubmitClick: SubmitHandler<Required<SignInValues>> = async (
    values,
  ) => {
    try {
      await dispatch(login(values)).unwrap();
      navigate(AppRoutes.Root);
    } catch (e) {
      if (e.name === AmplifyErrorTypes.UserNotConfirmed) {
        dispatch(setVerificationUsername(values.email));
        setNeedsConfirmation(true);
      }

      if (
        e.name === AmplifyErrorTypes.UserNotFound ||
        e.name === AmplifyErrorTypes.NotAuthorized
      ) {
        enqueueSnackbar('Incorrect username or password.', {
          variant: 'error',
          autoHideDuration: 5000,
        });
      }
    }
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
          helperText={errors.email?.message}
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
          helperText={errors.password?.message}
          {...register('password')}
        />
      </Grid>
      <Grid item xs={12}>
        <LoadingButton
          loading={loading}
          variant="contained"
          disableElevation
          fullWidth
          onClick={handleSubmit(onSubmitClick)}
        >
          Sign in
        </LoadingButton>
      </Grid>
    </Grid>
  );
}

function SignUpForm({ setNeedsConfirmation }: FormProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const loading = useSelector(loadingSelector);

  const onSubmitClick: SubmitHandler<SignUpValues> = async ({
    email,
    password,
    name,
  }) => {
    try {
      const { isConfirmed } = await dispatch(
        signUp({ email, name, password }),
      ).unwrap();
      setNeedsConfirmation(!isConfirmed);
    } catch (e) {
      if (e.name === AmplifyErrorTypes.UsernameExists) {
        enqueueSnackbar(e.message, {
          variant: 'error',
          autoHideDuration: 5000,
        });
      }
    }
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
          helperText={errors.name?.message}
          {...register('name')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email address"
          required
          error={!!errors.email}
          helperText={errors.email?.message}
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
          helperText={errors.password?.message}
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
          helperText={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </Grid>
      <Grid item xs={12}>
        <LoadingButton
          loading={loading}
          variant="contained"
          disableElevation
          fullWidth
          onClick={handleSubmit(onSubmitClick)}
        >
          Sign up
        </LoadingButton>
      </Grid>
    </Grid>
  );
}

function VerifyAccountForm({ setNeedsConfirmation, setTab }: FormProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<VerifyValues>({
    resolver: zodResolver(verifyFormSchema),
    mode: 'onChange',
  });

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const loading = useSelector(loadingSelector);

  const onSubmitClick: SubmitHandler<Required<VerifyValues>> = async (
    values,
  ) => {
    try {
      await dispatch(verifyAccount(values)).unwrap();
      setNeedsConfirmation(false);
      if (setTab) {
        setTab(TabValue.SignIn);
      }
    } catch (e) {
      if (e.name === AmplifyErrorTypes.CodeMismatch) {
        enqueueSnackbar(e.message, {
          variant: 'error',
          autoHideDuration: 5000,
        });
      }
    }
  };

  return (
    <>
      <Box display="flex" alignItems="center" p={2}>
        <IconButton onClick={() => setNeedsConfirmation(false)}>
          <ArrowBackOutlined />
        </IconButton>
        <Typography ml={1} variant="h6">
          Back to log in screen
        </Typography>
      </Box>
      <Grid container rowSpacing={2} py={12} px={8}>
        <Grid item xs={12}>
          <Typography variant="h6">Confirm your account creation</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Verification code"
            required
            error={!!errors.verificationCode}
            helperText={errors.verificationCode?.message}
            {...register('verificationCode')}
          />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            loading={loading}
            variant="contained"
            disableElevation
            fullWidth
            onClick={handleSubmit(onSubmitClick)}
          >
            verify account
          </LoadingButton>
        </Grid>
      </Grid>
    </>
  );
}

function Authentication() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabValue>(TabValue.SignIn);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  useEffect(() => {
    dispatch(resetFilesState());
    localStorage.setItem('offlineMode', 'false');
  }, []);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: TabValue) => {
    setTab(newValue);
  };

  const handleEnableOfflineMode = async () => {
    await dispatch(setOfflineMode(true));
    localStorage.setItem('offlineMode', 'true');
    navigate(AppRoutes.Root);
  };

  return (
    <Grid css={authPage} container>
      <Button
        variant="contained"
        css={offlineButton}
        disableElevation
        color="inherit"
        startIcon={<CloudOff />}
        onClick={handleEnableOfflineMode}
      >
        Use in offline mode
      </Button>
      <Grid item xs={12} sm={8} md={7} lg={6} xl={4}>
        <OfflineAlert standalone noButton css={offlineAlert} />
        <Paper css={authFormCard}>
          {needsConfirmation ? (
            <VerifyAccountForm
              setNeedsConfirmation={setNeedsConfirmation}
              setTab={setTab}
            />
          ) : (
            <>
              <Tabs
                value={tab}
                onChange={handleChangeTab}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab value={TabValue.SignIn} label="sign in" />
                <Tab value={TabValue.SignUp} label="create new account" />
              </Tabs>
              <Box py={12} px={8}>
                {tab === TabValue.SignIn ? (
                  <SignInForm setNeedsConfirmation={setNeedsConfirmation} />
                ) : (
                  <SignUpForm setNeedsConfirmation={setNeedsConfirmation} />
                )}
              </Box>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Authentication;
