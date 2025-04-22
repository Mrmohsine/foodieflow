import React, { StrictMode } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'  // Corrected import
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UsersProvider  } from './components/context/users.jsx' 
import { UseUserByAdmin  } from './components/context/usersByAdmin.jsx' 
import { UseProductsByAdmin  } from './components/context/productsByAdmin.jsx' 
import { UseProductsForClient } from './components/context/ProductsForClient.jsx'
import { UseProductsOrdered } from './components/context/ProductsOrdered.jsx'
import { UserProvider } from './components/context/user.jsx'
import { UseProductsOrderedForClientProvider } from './components/context/ProductsOrderedForClient.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <UserProvider>
      <UsersProvider>
      <UseUserByAdmin>
      <UseProductsByAdmin >
      <UseProductsForClient>
        <UseProductsOrdered>
        <UseProductsOrderedForClientProvider >
        <App />
        </UseProductsOrderedForClientProvider>
        </UseProductsOrdered>
      </UseProductsForClient>
      </UseProductsByAdmin>
      </UseUserByAdmin>
      </UsersProvider>
      </UserProvider>
    </Router>
  </StrictMode>,
)