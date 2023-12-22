import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      window.location.assign("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100vw",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Login</Typography>
        <Box>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete="off"
          />
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete="off"
          />

          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ mt: 2, width: "100%" }}
          >
            Login
          </Button>

          <Button
            variant="contained"
            onClick={ ()=> window.location.assign("/register")}
            sx={{ mt: 2, width: "100%" }}
          >
            SignUp
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
