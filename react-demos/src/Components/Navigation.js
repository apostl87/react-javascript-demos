import React from "react";
import { useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@nextui-org/react";
import icon from './Icon_Brand_small.png';

export default function NavigationNext() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const menuItems = [
    "Home",
    "Product Portfolio Example",
    "Space Game Example",
    "About",
    "Contact",
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-gray-700 text-white h-12 mt-1">

      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden bg-gray-900 h-11 mt-3"
        />
        <NavbarBrand>
          <img src={icon} className="mt-2 w-7 animate-spin-slow" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4 text-white pt-3" justify="center">
        {menuItems.map((item, index) => {
          let extraclasses = ''
          let itemnospace = item.replaceAll(" ", "");
          if (location.pathname === `/${itemnospace.toLowerCase()}`) {
            extraclasses = 'text-gray-400 font-bold';
          }
          return (
            <Link key={`${item}-${index}`} href={itemnospace.replace(" ", "").toLowerCase()} className={"text-white hover:text-gray-300 hover:no-underline " + extraclasses}>
              <NavbarItem key={`${item}-${index}`} className="hover:bg-gray-600 pt-2 pb-2 pl-1 pr-1 rounded-md">
                {item}
              </NavbarItem>
            </Link>
          )
        }
        )}
      </NavbarContent>

      <NavbarContent justify="end" className="text-white pt-3 gap-1">
        <Link href="#" className="text-black hover:text-gray-300 hover:no-underline">
          <NavbarItem className="lg:flex bg-white hover:bg-gray-600 pt-0 pb-0 pl-2 pr-2 rounded-md">
            Login
          </NavbarItem>
        </Link>
        <Link href="#" className="text-black hover:text-gray-300 hover:no-underline">
          <NavbarItem className="lg:flex bg-gray-400 hover:bg-gray-600 pt-0 pb-0 pl-2 pr-2 rounded-md">
            Sign Up
          </NavbarItem>
        </Link>
      </NavbarContent>

      <NavbarMenu className="top-13">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                location.pathname === `/${item.replaceAll(" ", "").toLowerCase()}` ? "primary" : index === menuItems.length - 1 ? "foreground" : "foreground"
              }
              className="w-full"
              href={`/${item.replaceAll(" ", "").toLowerCase()}`}
              size="lg"
              onPress={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
