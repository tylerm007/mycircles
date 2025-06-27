import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Keycloak from 'keycloak-js'
import { ReactKeycloakProvider } from '@react-keycloak/web'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// Example Keycloak integration using keycloak-js and a context provider

// 1. Install dependencies:
// npm install keycloak-js @react-keycloak/web

// 2. Create a Keycloak instance and provider in your main entry point:


// Create the Keycloak instance outside of any component to avoid re-initialization
const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'kcals', // Make sure this matches your Keycloak realm exactly
  clientId: 'alsclient', // Make sure this matches your Keycloak clientId exactly
})
/*
// Render the app with ReactKeycloakProvider, letting it handle Keycloak initialization
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: 'login-required' }}
    >
      <App />
    </ReactKeycloakProvider>
  </StrictMode>
)
  */