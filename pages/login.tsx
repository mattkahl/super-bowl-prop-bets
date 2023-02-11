import * as React from "react";

import { createTheme, ThemeProvider,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
} from "@mui/material";

import { CheckCircleOutline, LockOutlined } from "@mui/icons-material";
import { useStore } from "@/src/clientState";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const store = useStore();

  const onSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await store.attemptSignup({
      name: data.get('name') as string,
      email: data.get('email') as string,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={onSignupSubmit}
            sx={{ mt: 3, "& .MuiTextField-root": { mb: 2 } }}
          >
            <TextField
              required
              fullWidth
              disabled={Boolean(store.signupSuccessMessage) || store.isSignupInProgress}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <TextField
              autoComplete="given-name"
              name="name"
              required
              fullWidth
              disabled={Boolean(store.signupSuccessMessage) || store.isSignupInProgress}
              id="name"
              label="Name"
              autoFocus
            />
            {
              store.signupErrorMessage && (
                <Alert severity="error">
                  {store.signupErrorMessage}
                </Alert>
              )
            }
            {
              store.signupSuccessMessage && (
                <Alert severity="success">
                  {store.signupSuccessMessage}
                </Alert>
              )
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={Boolean(store.signupSuccessMessage) || store.isSignupInProgress}
            >
              {Boolean(store.signupSuccessMessage) ? <CheckCircleOutline /> : "Sign Up"}
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
