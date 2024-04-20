import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {

// handleLogOut: Clears the localStorage and reloads the page.
// handleLogin: Redirects to the login page.
// handleRegister: Redirects to the registration page.
// handleExplore: Redirects back to the explore page ("/").
  
  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload()
  };

  const handleLogin = () => {
    history.push("/login");
  };

  const handleRegister = () => {
    history.push("/register");
  };

  const handleExplore = ()=>{
    history.push("/");
  }
  const history = useHistory();
  return (
    <Box className="header">
      {/* <Box className="header-title">
        <img src="logo_dark.svg" alt="QKart-icon"></img>
      </Box> */}
      {/* <Stack direction="row" spacing={2} justifyContent="flex-end">
          {b}
        </Stack> */}
        {children}
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variation="text"
          onClick={handleExplore}
        >
          BACK TO EXPLORE
        </Button>
      ) : localStorage.getItem("username") ? (
        <>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <div className="avatar">
              <img src="avatar.png" alt={localStorage.getItem("username")}></img>
              <span className="userName">{localStorage.getItem("username")}</span>
            </div>
            <Button
              variant="text"
              onClick={() => {
                handleLogOut();
              }}
            >
              LOGOUT
            </Button>
          </Stack>
        </>
      ) : (
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="text" onClick={handleLogin}>
            LOGIN
          </Button>
          <Button variant="contained" onClick={handleRegister}>
            REGISTER
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
