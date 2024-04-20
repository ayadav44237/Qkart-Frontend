import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */

  const [loginStatus, setLoginStatus] = useState("unsubmitted");

  const [localStorageStatus, setLocalStorageStatus] = useState(undefined);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    let [key, value] = [e.target.name, e.target.value];
    setLoginData({
      ...loginData,
      [key]: value,
    });
  };

  const login = async (formData) => {
    
    console.log(formData,"Hellojdbguhdfbguhdb");
    const valid = validateInput(formData);
    if (valid) {
      // console.log("ashfisuhfiujs")
      setLoginStatus("submitted");
      try {
        let res = await axios.post(`${config.endpoint}/auth/login`, formData);
    
        enqueueSnackbar("Logged in successfully", { variant: "success" });
        console.log(res.data)
        persistLogin(res.data.token, res.data.username, res.data.balance);
        history.push("/")
        setLoginStatus("unsubmitted");
      } catch (e) {
        if (e.response) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON",
            { variant: "error" }
          );
        }
        setLoginStatus("unsubmitted");
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    let msg = "";

    if (!data.username){
      msg = "Username is a required field";
    }
    else if (!data.password){
       msg = "Password is a required field";
    }

    if (msg) {
      enqueueSnackbar(msg, { variant: "warning" });
      return false;
    } else {
      return true;
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
   
    // Stores the login information (token, username, balance) in the localStorage.
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
   
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={loginData.username}
            placeholder="Enter Username"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={loginData.password}
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={handleChange}
          />
          {loginStatus === "unsubmitted" ? (
            <Button
              className="button"
              variant="contained"
              onClick={() => login(loginData)}
            >
              LOGIN TO QKART
            </Button>
          ) : (
            <div className="spinner">
              <CircularProgress />
            </div>
          )}
          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link className="link" to="/register">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;











































// Certainly! Let's break down the workflow of the  above code:

// Imports: The code begins with importing various modules and components from external libraries and files. Notable imports include components from Material-UI (Button, CircularProgress, TextField), Axios for making HTTP requests, and useSnackbar from "notistack" for displaying snackbars.

// Component Definition: The Login component is defined as a functional component.

// State Initialization: Several state variables are initialized using the useState hook:

// loginStatus: Tracks the status of the login process.
// localStorageStatus: Tracks the status of localStorage usage.
// loginData: Holds the username and password entered by the user.
// Event Handlers:

// handleChange: Handles changes in input fields (username and password) and updates the loginData state accordingly.
// Login Function (login):

// Performs the login API call using Axios (axios.post).
// Displays appropriate messages using enqueueSnackbar from notistack based on the response received from the server.
// If the login is successful, it calls persistLogin function to store login information in localStorage and redirects the user to the home page.
// Input Validation (validateInput):

// Validates the input data (username and password) to ensure they are not empty.
// Displays warning messages if validation fails.
// Persist Login Information (persistLogin):

// Stores the login information (token, username, balance) in the localStorage.
// Render Method:

// Renders the login form using Material-UI components (TextField, Button).
// Shows a spinner when the login is in progress.
// Provides a link to the registration page for users who don't have an account.
// Renders a header and footer component.
// Return Statement:

// Returns JSX markup for the Login component.



// Overall Workflow:

// When the user enters their credentials and clicks the login button, the login function is called.
// The login function validates the input, makes an API call to the backend, and handles the response.
// If the login is successful, the user's login information is stored in localStorage, and they are redirected to the home page.
// If there are any errors during the login process, appropriate messages are displayed to the user.
// This workflow describes how the provided code handles user login functionality in a React application.