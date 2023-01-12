import { createTheme } from '@mui/material';

export const theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: 16,
        },
      },
    },
  },
});
