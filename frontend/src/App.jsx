import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f1f1f1",
        },
      },
    },
  },
});

const App = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline style={{ backgroundColor: "#f1f1f1" }} />
      <Router>
        <Switch>
          <Route exact path="/">
            {isLoggedIn ? (
              <Redirect to="/dashboard" />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route exact path="/login">
            {isLoggedIn ? <Redirect to="/dashboard" /> : <Login />}
          </Route>
          <Route exact path="/register">
            {isLoggedIn ? <Redirect to="/dashboard" /> : <Register />}
          </Route>
          <Route exact path="/dashboard">
            {isLoggedIn ? <Dashboard /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
