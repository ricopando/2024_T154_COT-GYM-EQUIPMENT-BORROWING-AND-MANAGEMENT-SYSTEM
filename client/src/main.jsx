import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProvider from './theme/ThemeProvider'; // Ensure the correct import path
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Using Day.js adapter

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </LocalizationProvider>
  </React.StrictMode>
);
