import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async'; // ya instale reac HelmetProvider


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

//nuevo despues de HelmetProvider

  ReactDOM.createRoot(document.getElementById('root')).render(      
          <React.StrictMode>
            <HelmetProvider>
              <BrowserRouter> { /* O el router que uses */ }
                <App />
              </BrowserRouter>
            </HelmetProvider>
          </React.StrictMode>
        );