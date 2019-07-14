import React, { useCallback } from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { Auth0Provider } from "./react-auth0-spa"
import config from "./auth_config.json"

const Auth0ProviderContainer = ({ children }) => {
  return (
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin}
    >
      {children}
    </Auth0Provider>
  )
}

ReactDOM.render(
  <Auth0ProviderContainer>
    <App />
  </Auth0ProviderContainer>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
