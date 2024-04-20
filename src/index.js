import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import theme from "./theme";

ReactDOM.render(
  <React.StrictMode> 
    {/* activates additional checks and warnings for its descendants. */}
    <ThemeProvider theme={theme}>
      <BrowserRouter>
      {/* This component is provided by React Router and is used for client-side routing in your application. It enables declarative routing for your React components. By wrapping your application with BrowserRouter, you can use features like <Link> and <Route> to handle navigation. */}
        <SnackbarProvider
          maxSnack={1}
          // maxSnack={1} ensures that only one snackbar is displayed at a time
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          preventDuplicate
        >
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

