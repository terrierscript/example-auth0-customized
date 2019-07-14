import React, { useState } from "react"
import { NavLink as RouterNavLink } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap"

import { useAuth0 } from "../react-auth0-spa"

const AuthenticatedDesktopMenu = () => {
  const { user, logoutWithRedirect } = useAuth0()

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret id="profileDropDown">
        <img
          src={user.picture}
          alt="Profile"
          className="nav-user-profile rounded-circle"
          width="50"
        />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>{user.name}</DropdownItem>
        <DropdownItem
          tag={RouterNavLink}
          to="/profile"
          className="dropdown-profile"
          activeClassName="router-link-exact-active"
        >
          <FontAwesomeIcon icon="user" className="mr-3" /> Profile
        </DropdownItem>
        <DropdownItem id="qsLogoutBtn" onClick={() => logoutWithRedirect()}>
          <FontAwesomeIcon icon="power-off" className="mr-3" /> Log out
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

const AuthenticatedMobileMenu = () => {
  const { user, logoutWithRedirect } = useAuth0()

  return (
    <Nav
      className="d-md-none justify-content-between"
      navbar
      style={{ minHeight: 170 }}
    >
      <NavItem>
        <span className="user-info">
          <img
            src={user.picture}
            alt="Profile"
            className="nav-user-profile d-inline-block rounded-circle mr-3"
            width="50"
          />
          <h6 className="d-inline-block">{user.name}</h6>
        </span>
      </NavItem>
      <NavItem>
        <FontAwesomeIcon icon="user" className="mr-3" />
        <RouterNavLink to="/profile" activeClassName="router-link-exact-active">
          Profile
        </RouterNavLink>
      </NavItem>
      <NavItem>
        <FontAwesomeIcon icon="power-off" className="mr-3" />
        <RouterNavLink
          to="#"
          id="qsLogoutBtn"
          onClick={() => logoutWithRedirect()}
        >
          Log out
        </RouterNavLink>
      </NavItem>
    </Nav>
  )
}

const LoginButton = ({ ...props }) => {
  const { loginWithRedirect } = useAuth0()
  return (
    <Button {...props} onClick={() => loginWithRedirect({})}>
      Log in
    </Button>
  )
}
const UnauthenticatedDesktopMenu = () => {
  return (
    <NavItem>
      <LoginButton id="qsLoginBtn" color="primary" className="btn-margin" />
    </NavItem>
  )
}
const UnauthenticatedMobileMenu = () => {
  return (
    <Nav className="d-md-none" navbar>
      <NavItem>
        <LoginButton id="qsLoginBtn" color="primary" block />
      </NavItem>
    </Nav>
  )
}

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAuth0()
  const toggle = () => setIsOpen(!isOpen)

  return (
    <div className="nav-container">
      <Navbar color="light" light expand="md">
        <Container>
          <NavbarBrand className="logo" />
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/"
                  exact
                  activeClassName="router-link-exact-active"
                >
                  Home
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="d-none d-md-block" navbar>
              {!isAuthenticated && <UnauthenticatedDesktopMenu />}
              {isAuthenticated && <AuthenticatedDesktopMenu />}
            </Nav>
            {!isAuthenticated && <UnauthenticatedMobileMenu />}
            {isAuthenticated && <AuthenticatedMobileMenu />}
          </Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavBar
