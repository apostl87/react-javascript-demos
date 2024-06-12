import logo from '../logo.svg';
import React from 'react';
import Link from'react-router-dom';
import { Navbar, Nav } from 'rsuite';
import CogIcon from '@rsuite/icons/legacy/Cog';
import PinedIcon from '@rsuite/icons/Pined';

function NavigationBar() {
    return (
        <nav>
            <img src={logo} className="App-logo" alt="logo" />
            <Navbar>
                <Nav>
                    <Nav.Item icon={<PinedIcon />}>Home</Nav.Item>
                    <Nav.Item href="/productportfolio">Example Product Portfolio</Nav.Item>
                    <Nav.Menu title="About">
                        <Nav.Item>Company</Nav.Item>
                        <Nav.Item>Team</Nav.Item>
                        <Nav.Menu title="Contact">
                            <Nav.Item>Via email</Nav.Item>
                            <Nav.Item>Via telephone</Nav.Item>
                        </Nav.Menu>
                    </Nav.Menu>
                </Nav>
                <Nav pullRight>
                    <Nav.Item icon={<CogIcon />}>Settings</Nav.Item>
                </Nav>
            </Navbar>
        </nav>
    );
}

export default NavigationBar;