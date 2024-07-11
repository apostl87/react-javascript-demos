import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DownCaret, UpCaret } from './Misc.js';

const NavmenuNew = ({ label, path, link, children }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [forcedOpen, setForcedOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(location.pathname.split("/").includes(path));
  }, [location.pathname, path])

  const childIsActive = (childPath) => {
    return location.pathname.split("/").includes(childPath);
  }

  const contentWithChildren =
    <div className='flex flex-row flex-nowrap'> {/* using Tailwind classes here for ease */}
      <span>
        {label}
      </span>
      {
        isOpen ? <UpCaret size='6' color={isHovered ? 'white' : (isActive ? 'black' : 'white')} className="mt-2 ml-2" />
          : <DownCaret size='6' color={isHovered ? 'white' : (isActive ? 'black' : 'white')} className="mt-2 ml-2" />
      }
    </div>

  return (
    <>
      {children ?
        <div onMouseEnter={() => { setIsOpen(true); }}
          onMouseLeave={() => { setIsOpen(false); }}>

          {link ?
            <Link className={`navigation-menu-item ${isActive && " active"}`}
              onMouseEnter={() => { setIsHovered(true); }}
              onMouseLeave={() => { setIsHovered(false); }}
              onClick={() => { setForcedOpen(!isOpen); setIsOpen(!isOpen); }}
              to={path}>
              {contentWithChildren}
            </Link>
            :
            <div className={`navigation-menu-item ${isActive && " active"}`}
              onMouseEnter={() => { setIsHovered(true); }}
              onMouseLeave={() => { setIsHovered(false); }}
              onClick={() => { setForcedOpen(!isOpen); setIsOpen(!isOpen); }}
            >
              {contentWithChildren}
            </div>
          }

          {(forcedOpen || isOpen) && children.map((subItem, index) => (
            <Link key={subItem.path} to={path + "/" + subItem.path}
              className={`navigation-menu-item-child ${childIsActive(subItem.path) ? "active " : ""}`}>
              <div className=''>{subItem.label}</div>
            </Link>
          ))
          }
        </div>
        :
        <Link to={path}
          className={`navigation-menu-item ${isActive && " active"}`} >
          {label}
        </Link>
      }
    </>
  );
};

export default NavmenuNew
