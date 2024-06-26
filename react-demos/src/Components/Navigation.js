import React from "react";
import { useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@nextui-org/react";
import icon from './Icon_Brand_small.png';
import AuthenticationUI from "../Views/AuthenticationUI";
import '../static/css/NavbarItemCustom.css';
import NavbarItemCustom from "./NavbarItem";
import NavbarMenuItemCustom from "./NavbarMenuItem";

export default function NavigationNext() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const location = useLocation();

  const menuItems = [
    { label: "Home", to: "home" },
    {
      label: "Demo examples", to: "examples",
      subMenu: [
        { label: "Manage product portfolio", to: "manage-product-portfolio" },
        { label: "Space game", to: "space-game" },
      ]
    },
    { label: "Contact", to: "contact" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-gray-950 text-white h-12 mt-1">

      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden bg-gray-900 hover:bg-gray-600 h-11 mt-3"
        />
        <NavbarBrand>
          <img src={icon} className="mt-2 w-7 animate-spin-slow" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-2 text-white pt-3" justify="center">
        {menuItems.map((item, index) => {
          return (
            <NavbarItemCustom label={item.label} to={item.to} subMenu={item.subMenu} />
          );
        })}
      </NavbarContent>

      <div className="w-32"></div>

      {/* Auth section */}
      <AuthenticationUI />

      {/* Collapsable menu for mobile devices and small-width-screens */}
      <NavbarMenu className="top-13">
        {menuItems.map((item, index) => {
          return (
            <NavbarMenuItemCustom label={item.label} to={item.to} subMenu={item.subMenu} />
          );
        })}
      </NavbarMenu>
    </Navbar>
  );
}
