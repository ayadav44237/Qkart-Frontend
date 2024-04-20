import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

   
  const [formStatus, setFormStatus] = useState("unsubmitted");

  
  let handleChange = (e) => {
    let [key, value] = [e.target.name, e.target.value];
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const register = async (formData) => {
    debugger;
    history.push("/login"); //redirect to login after success
    const valid=validateInput(formData);
    if(valid){
      setFormData("submitted");
      try{
         let res=await axios.post(`${config.endpoint}/auth/register`,
         {
           username:formData.username,
           password: formData.password,
           
         }
         );
         enqueueSnackbar("Registered Successfully",{varient: "submitted"});
         setFormData("unsubmitted");

      }
      catch(e){
        setFormData("submitted");
        if(e.response){
          enqueueSnackbar(e.response.data.message,{varient:"error"});
        }
        else{
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.")
        }
        setFormData("unsubmitted");
      }

      }
  };


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
      let msg="";
      if(!data.username){
        msg="Username is a required filed";
      }
      else if(data.username.length<6){
        msg="Username length should be greater than 6"
      }
      else if(!data.password){
       msg ="Password is a required field"
      }
      else if(data.password.length<6){
        msg="Password should be greater than 6";
      }
      else if(data.confirmPassword!==data.password){
        msg="do not match";
      }

      if(msg){
        enqueueSnackbar(msg,{variant:"warning"});
        return false;
      }
      else{
        return true;
      }
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={formData.username}
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
            value={formData.password}
            onChange={handleChange}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            fullWidth
          />
          {formStatus==="unsubmitted"?<Button
            className="button"
            variant="contained"
            onClick={() => register(formData)}
          >
            Register Now
          </Button>:<div className="spinner"><CircularProgress/></div>}
          <p className="secondary-action">
            Already have an account?{" "}
            {/* Using <a> tag refreshes the page whereas <Link> component will redirect to a different page without refreshing */}
            <Link href="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;


























//Test Case Explanation

// ✓ should have a Register form title (626 ms)
// ( Change of register    <h2 className="title">Register</h2>, line 144 in register.js)

// ✓ should have header with logo (143 ms)
// (inside  footer commenting   <img src="logo_dark.svg" alt="QKart-icon"></img>

// ✓ should have header with 'back to explore' button (249 ms)
// (can be done with two ways  both in register and header 
// for
// register  remove <Header hasHiddenAuthButtons /> line 141
// for Header)


// ✓ should have 'login here' link (188 ms)
// (inside Register  below Login here in link Line 187)

//Validate Function will be seen in case of failing the  below test cases
// ✓ should show error message if username empty (973 ms)
// ✓ should show error message if username < 6 characters (1235 ms)
// ✓ should show error message if password empty (408 ms)
// ✓ should show error message if password < 6 chars long (579 ms)
// ✓ should show error message if password and confirm password are not same (1114 ms)

//Register Function inside the const register responsible failing these testcases
// ✓ should send a POST request with axios (1063 ms)
// ✓ should send a POST request to server with correct arguments (1072 ms)
// ✓ should show success alert if request succeeds (1073 ms)
// ✓ should show error alert with message sent from backend if request fails (1158 ms)


// ✓ should redirect to login after success (861 ms)
// (History.push () inside register.js inside const register line 58)


// ✓ 'back to explore' button on Header should route to products (208 ms)
// (Inside Header.js Handle Explore  onClick={handleExplore}
// line 46 )








// Certainly! Let's break down the workflow of the provided Register component:

// Imports: The code begins with importing necessary modules, components, and styles similar to the Login component.

// Component Definition: The Register component is defined as a functional component.

// State Initialization: Two state variables are initialized using the useState hook:

// formData: Holds the user input data including username, password, and confirmPassword.
// formStatus: Tracks the status of the registration form.
// Event Handlers:

// handleChange: Handles changes in input fields (username, password, and confirmPassword) and updates the formData state accordingly.
// Register Function:

// Performs the registration API call using Axios (axios.post).
// Validates the input data using the validateInput function.
// Redirects to the login page after successful registration.
// Displays appropriate messages using enqueueSnackbar from notistack based on the response received from the server.
// Input Validation (validateInput):

// Validates the input data (username, password, and confirmPassword) to ensure they meet certain criteria.
// Displays warning messages if validation fails.
// Render Method:

// Renders the registration form using Material-UI components (TextField, Button).
// Shows a spinner when the registration is in progress.
// Provides a link to the login page for users who already have an account.
// Renders a header and footer component.
// Return Statement:

// Returns JSX markup for the Register component.



// Overall Workflow:


// Certainly! Here's an elaboration of the workflow of the Register component:

// User Input Handling:

// As the user fills in the registration form, the handleChange function updates the formData state with the values entered by the user.
// Form Submission:

// When the user clicks on the "Register Now" button, the register function is invoked.
// Before initiating the registration process, the input data is validated using the validateInput function.
// Input Validation:

// The validateInput function checks the validity of the input data:
// It ensures that the username is not empty and has a length of at least 6 characters.
// It ensures that the password is not empty and has a length of at least 6 characters.
// It checks if the confirmPassword matches the password.
// If any validation fails, a warning message is displayed using enqueueSnackbar, and the registration process is halted.
// API Call:

// If the input data passes validation, an API call is made to the backend using Axios (axios.post).
// The registration data (username and password) is sent to the backend endpoint for registration.
// Handling API Responses:

// Upon receiving a response from the backend:
// If the registration is successful (HTTP status 201), a success message is displayed using enqueueSnackbar, and the user is redirected to the login page (history.push("/login")).
// If there's an error (HTTP status 400 or other network errors), an error message is displayed using enqueueSnackbar, informing the user about the issue.
// Form Status Update:

// During the registration process, the formStatus state is updated to reflect the current state of the form ("unsubmitted" or "submitted").
// This state is used to conditionally render either the registration button or a spinner indicating that the registration process is in progress.
// User Interaction:

// The user can navigate to the login page using the provided link if they already have an account.
// Rendering:

// The registration form, including input fields for username, password, and confirmPassword, is rendered using Material-UI components (TextField, Button).
// Error messages for validation failures and a link to the login page are also displayed as part of the form.
// The layout includes a header and footer component for consistency.
// Completion:

// Once the registration process is complete (successful or unsuccessful), the user is informed about the outcome through snackbar notifications.
// Overall, this workflow outlines how the Register component handles user registration by managing user input, performing input validation, making API calls, and providing feedback to the user throughout the registration process.


