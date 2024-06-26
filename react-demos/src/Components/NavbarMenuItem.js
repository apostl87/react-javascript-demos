import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../static/css/NavbarItem.css';

const NavbarMenuItemCustom = ({ label, key, subMenu }) => {


  let isActive = window.location.pathname.split("/").includes(key)
  const activeClasses = isActive ? 'text-gray-500 font-bold' : '';

  let mainItem;
  let subItems;

  if (!subMenu) {
    mainItem =
      <Link key={key} className="menu-link hover:text-gray-300 hover:no-underline text-black rounded-md bg-gray-200">
        <div className={activeClasses + " menu-item hover:bg-gray-600 pt-2 pb-2 pl-1 pr-1 text-black cursor-pointer"}>
          {label}
        </div>
      </Link>

    subItems = null
  } else {
    mainItem =
      <div className={activeClasses + " menu-item pt-2 pb-2 pl-1 pr-1 rounded-md text-black cursor-text  bg-gray-200"}>
        {label}
      </div>;

    subItems =
      <>
        {subMenu.map((subItem, index) => (

          <div className={activeClasses + " menu-item hover:bg-gray-600 pt-2 pb-2 pl-1 pr-1 rounded-md text-black cursor-pointer"}>
            <Link key={key + "/" + subItem.key} className="menu-link hover:text-gray-300 hover:no-underline text-black">
              {subItem.label}
            </Link>

          </div>
        ))}
      </>
  }

  return (
    <>
      {mainItem}
      {subItems}
    </>
  );
};

export default NavbarMenuItemCustom;

{/* <NavbarMenuItem key={`${item.label}-${index}`}>
<Link
  color={location.pathname === `/${item.key}` ? "primary" : index === menuItems.length - 1 ? "foreground" : "foreground"}
  className="w-full"
  href={`/${item.key}`}
  size="lg"
  onPress={() => setIsMenuOpen(false)}
>
  {item.label}
</Link>
{item.subMenu && (
  <div className="dropdown-content hidden absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
    {item.subMenu.map((subItem, subIndex) => (
      <Link key={`${subItem}-${subIndex}`} href={`/${item.key}/${subItem.toLowerCase().replace(" ", "-")}`} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
        {subItem}
      </Link>
    ))}
  </div>
)}
</NavbarMenuItem> */}