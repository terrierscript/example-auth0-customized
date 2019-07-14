import React, { FC, useState, useEffect, useContext, useCallback } from "react"
import createAuth0Client from "@auth0/auth0-spa-js"

type Auth0ContextValue = ReturnType<typeof useAuthValues>

export const Auth0Context = React.createContext<undefined | Auth0ContextValue>(
  undefined
)

const useAuth0Raw = () => {
  const ctx = useContext(Auth0Context)
  if (ctx === undefined) {
    throw new Error()
  }
  return ctx
}
export const useAuth0 = () => {
  const ctx = useContext(Auth0Context)
  if (ctx === undefined) {
    throw new Error()
  }
  const { setUser, setIsAuthenticated, auth0Client, ...rest } = ctx

  return rest
}

export const usePopup = () => {
  const ctx = useAuth0Raw()
  const { auth0Client, setUser, setIsAuthenticated } = ctx
  const [popupOpen, setPopupOpen] = useState(false)
  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true)
    try {
      await auth0Client.loginWithPopup(params)
    } catch (error) {
      console.error(error)
    } finally {
      setPopupOpen(false)
    }
    const user = await auth0Client.getUser()
    setUser(user)
    setIsAuthenticated(true)
  }
  return {
    popupOpen,
    loginWithPopup
  }
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

  const handleRedirectCallback = async () => {
    setLoading(true)
    await auth0Client.handleRedirectCallback()
    const user = await auth0Client.getUser()
    setLoading(false)
    setIsAuthenticated(true)
    setUser(user)
  }
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
    auth0Client,
    loading,
    setUser,
    setIsAuthenticated,
    logoutWithRedirect,
    handleRedirectCallback,
    getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
    loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
    getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
    getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
    logout: (...p) => auth0Client.logout(...p)
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
