import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'; // Only import ChakraProvider once
import { BrowserRouter } from "react-router-dom";

import App from '../src/App.jsx';

const theme = extendTheme({
  config: {
    initialColorMode: 'light', // Default to light mode, or change it to 'dark'
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
