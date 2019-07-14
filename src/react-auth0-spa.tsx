import React, { FC, useState, useEffect, useContext, useCallback } from "react"
import createAuth0Client from "@auth0/auth0-spa-js"

type Auth0ContextValue = ReturnType<typeof useAuthValues>

export const Auth0Context = React.createContext<undefined | Auth0ContextValue>(
  undefined
)

export const useAuth0 = (): Auth0ContextValue => {
  const ctx = useContext(Auth0Context)
  if (ctx === undefined) {
    throw new Error()
  }
  return ctx
}

const useAuthValues = initOptions => {
  const [isAuthenticated, setIsAuthenticated] = useState()
  const [user, setUser] = useState()
  const [auth0Client, setAuth0] = useState()
  const [loading, setLoading] = useState(true)

  const onRedirectCallback = useCallback(
    appState => {
      window.history.replaceState(
        {},
        document.title,
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname
      )
    },
    [window]
  )

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions)
      setAuth0(auth0FromHook)

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback()
        onRedirectCallback(appState)
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated()
      setIsAuthenticated(isAuthenticated)

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser()
        setUser(user)
      }
      setLoading(false)
    }
    initAuth0()
    // eslint-disable-next-line
  }, [])

  const logoutWithRedirect = useCallback(
    () =>
      auth0Client.logout({
        returnTo: window.location.origin
      }),
    [window.location.origin, auth0Client]
  )
  return {
    isAuthenticated,
    user,
    loading,
    logoutWithRedirect,
    loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p)
  }
}

export const Auth0Provider: FC<
  {
    onRedirectCallback?: (appState: any) => void
  } & Auth0ClientOptions
> = ({ children, ...initOptions }) => {
  const value = useAuthValues(initOptions)
  return <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>
}
