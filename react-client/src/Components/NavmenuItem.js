import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DownCaret, UpCaret } from './Misc.js';

const NavmenuItemCustom = ({ label, to, subMenu }) => {
  const [isOpen, setIsOpen] = useState(isActive(to));

  function toggleIsOpen() {
    setIsOpen(!isOpen)
  }

  function isActive(to) {
    return (window.location.pathname.split("/").includes(to));
  }

  let mainItem;
  let subItems;

  if (!subMenu) {
    mainItem =
      <Link to={to} className="navmenu-link hover:no-underline rounded-md" onClick={window.location.reload}>
        <div className={(isActive(to) ? "navmenu-item-active " : "") + "navmenu-item cursor-pointer"}>
          {label}
        </div>
      </Link>

    subItems = null
  } else {
    mainItem =
      <div className="navmenu-item flex flex-row justify-between" onClick={toggleIsOpen} onMouseEnter={() => setIsOpen(true)}>
        <span>
          {label}
        </span>
        {isOpen ? <UpCaret size='6' color={isActive(to) ? 'black' : 'white'} className="mt-2 ml-2" />
          : <DownCaret size='6' color={isActive(to) ? 'black' : 'white'} className="mt-2 ml-2" />
        }
      </div>;

    subItems =
      <div className='mt-0'>
        {subMenu.map((subItem, index) => (
          <Link key={index} to={to + "/" + subItem.to} className="hover:no-underline" onClick={window.location.reload}>
            <div className={(isActive(subItem.to) ? "navmenu-subitem-active " : "") + "navmenu-subitem ml-3 mt-1"}>
              {subItem.label}
            </div>
          </Link>
        ))}
      </div>
  }

  return (
    <div onMouseLeave={() => setIsOpen(isActive(to))}>
      {mainItem}
      {isOpen ? subItems : null}
    </div>
  );
};

export default NavmenuItemCustom;