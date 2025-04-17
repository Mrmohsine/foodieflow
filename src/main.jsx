import React, { StrictMode } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'  // Corrected import
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UsersProvider  } from './components/context/users.jsx' 
import { UseUserByAdmin  } from './components/context/usersByAdmin.jsx' 
import { UseProductsByAdmin  } from './components/context/productsByAdmin.jsx' 
import { UseProductsForClient } from './components/context/ProductsForClient.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <UsersProvider>
      <UseUserByAdmin>
      <UseProductsByAdmin >
      <UseProductsForClient>
        <App />
      </UseProductsForClient>
      </UseProductsByAdmin>
      </UseUserByAdmin>
      </UsersProvider>
    </Router>
  </StrictMode>,
)