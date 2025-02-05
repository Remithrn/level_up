import {  
  Navbar,   
  NavbarBrand,   
  NavbarContent,   
  NavbarItem,   
  NavbarMenuToggle,  
  NavbarMenu,  
  NavbarMenuItem
} from "@nextui-org/navbar";
import React from 'react';
import { AcmeLogo } from "./AcmeLogo";
import {  Button } from "@nextui-org/react";
import { useSelector } from "react-redux";
import SearchFriendsComponent from "./SearchUsers";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";

const NavbarDemo = () => {
  const message = useSelector((state) => state.auth.message);
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  return (
    <Navbar>
      <NavbarBrand>
        <Link to="/test" className="font-bold text-inherit">
        <div className="flex flex-row items-center gap-1">
          <AcmeLogo />
          Level Up

        </div>
        </Link>
      </NavbarBrand>
      
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {isAuthenticated ? (
          <>
            {/* <NavbarItem>
              <Link color="foreground" to="/">
                Home
              </Link>
            </NavbarItem> */}
            {/* <NavbarItem isActive>
              <Link to="/change/password" aria-current="page">
                Password reset
              </Link>
            </NavbarItem>
           
            <NavbarItem>
              <Link color="foreground" to="/ai/interview">
                Ai interview
              </Link>
            </NavbarItem> */}
            <SearchFriendsComponent />
          </>
        ) : (
          <NavbarItem>
            <Link color="foreground" to="/login">
              
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
      
      <NavbarContent justify="end">
        {isAuthenticated ? (
          <NavbarItem>
           
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link to="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} to="/signup" color="primary" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarDemo;
