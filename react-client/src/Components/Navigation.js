import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@nextui-org/react";
import iconBrand from '../media/icon-brand-small.png';
import UserArea from "../Components/UserArea";
import NavbarItemCustom from "./NavbarItem";
import NavmenuItemCustom from "./NavmenuItem";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  let menuItems = [
    { label: "Home", to: "home" },
    { label: "Retailer product portfolio", to: "merchant-product-portfolio" },
    {
      label: "Other Demos", to: "demos",
      subMenu: [
        { label: "Public product portfolio (no login required)", to: "product-portfolio" },
        { label: "Space game", to: "space-game" },
      ]
    },

    { label: "Contact", to: "contact" },
  ];

  if (process.env.NODE_ENV === 'development') {
    menuItems.push(
      {
        label: "Developer area", to: "devarea",
        subMenu: [
          { label: "Token service and request service", to: "01" },
          { label: "Other", to: "02" }
        ]
      },
    )
  }

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="navbar text-white h-12">

      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden bg-gray-900 hover:bg-gray-600 h-11 mt-3 w-12"
        />
        {/* <NavbarBrand>
          <img src={iconBrand} className="mt-2 w-7 animate-spin-slow" />
        </NavbarBrand> */}
      </NavbarContent>

      {menuItems.map((item, index) => {
        return (
          <NavbarContent key={index} className="hidden sm:flex gap-2 text-white pt-3">
            <NavbarItemCustom label={item.label} to={item.to} subMenu={item.subMenu} />
          </NavbarContent>
        );
      })}


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
