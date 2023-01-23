import type {} from '@mui/x-date-pickers/themeAugmentation';
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
        text: {
          borderRadius: 16,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
