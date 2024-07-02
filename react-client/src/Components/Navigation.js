import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@nextui-org/react";
import iconBrand from '../media/icon-brand-small.png';
import UserArea from "../Components/UserArea";
import NavbarItemCustom from "./NavbarItem";
import NavmenuItemCustom from "./NavmenuItem";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", to: "home" },
    {
      label: "Demo examples", to: "examples",
      subMenu: [
        { label: "Edit product portfolio (no login required)", to: "product-portfolio" },
        { label: "Fully manage retailer product portfolio", to: "merchant-product-portfolio" },
        { label: "Space game", to: "space-game" },
      ]
    },
    //{ label: "Testarea", to: "testarea"},
    { label: "Contact", to: "contact" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-gray-950 text-white h-12">

      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden bg-gray-900 hover:bg-gray-600 h-11 mt-3"
        />
        <NavbarBrand>
          {/* <img src={iconBrand} className="mt-2 w-7 animate-spin-slow" /> */}
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-2 text-white pt-3" justify="center">
        {menuItems.map((item, index) => {
          return (
            <NavbarItemCustom key={index} label={item.label} to={item.to} subMenu={item.subMenu} />
          );
        })}
      </NavbarContent>

      <div className="w-2"></div>

      {/* Auth section */}
      <UserArea />

      {/* Collapsable menu for mobile devices and small-width-screens */}
      <NavbarMenu className="top-13 gap-1">
        {menuItems.map((item, index) => {
          return (
            <NavmenuItemCustom key={index} label={item.label} to={item.to} subMenu={item.subMenu} />
          );
        })}
      </NavbarMenu>

    </Navbar>
  );
}
