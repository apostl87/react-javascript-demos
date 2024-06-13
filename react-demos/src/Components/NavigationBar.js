import logo from '../logo.svg';
import React from 'react';
import { Navbar, Nav } from 'rsuite';
import CogIcon from '@rsuite/icons/legacy/Cog';
import PinedIcon from '@rsuite/icons/Pined';

function NavigationBar() {
    return (
        <nav>
            <Navbar>
            <span align='left'><img align='left' src={logo} className="App-logo" alt="logo" /></span>
                <Navbar.Body>
                    <Nav>
                    <Nav.Item icon={<PinedIcon />}>Home</Nav.Item>
                    <Nav.Item href="/productportfolio">Example Product Portfolio</Nav.Item>
                    <Nav.Item href="/spacegame">Example JS Spacegame</Nav.Item>
                    <Nav.Item><Nav.Menu title="About">
                        <Nav.Item>Company</Nav.Item>
                        <Nav.Item>Team</Nav.Item>
                        <Nav.Menu title="Contact">
                            <Nav.Item>Via email</Nav.Item>
                            <Nav.Item>Via telephone</Nav.Item>
                        </Nav.Menu>
                    </Nav.Menu>
                    </Nav.Item>
                </Nav>
                </Navbar.Body>
            </Navbar>
        </nav>
    );
}

export default NavigationBar;