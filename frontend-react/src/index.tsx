import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles/darkMode.css';
import { ThemeProvider } from './config/theme/ThemeContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider>
    <App />
    </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);


