import {useContext} from 'react';
import {Link} from 'react-router-dom';
import {Navbar, Form, Nav} from 'react-bootstrap';

import { UserContext } from '../contexts/userContext';

import brandLogo from '../images/fw_logo.png';

import NotLogged from './micro/NotLogged';
import Logged from './micro/Logged';

function MyNavbar() {
    const [state] = useContext(UserContext);

    return(
        <Navbar fixed="top">
            {
                state.user?.role === "partner" ? 
                <Navbar.Brand as={Link} to="/partner" >
                WaysFood{' '}
                <img
                    src={brandLogo}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    alt="FoodWays logo"
                />
                </Navbar.Brand> :
                <Navbar.Brand as={Link} to="/" >
                WaysFood{' '}
                <img
                    src={brandLogo}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    alt="FoodWays logo"
                />
                </Navbar.Brand>    
            }
            
            <Nav className="mr-auto">
            </Nav>

            <Form inline>
                {state.loginStatus ? <Logged /> : <NotLogged />}
            </Form>
        </Navbar>
    );
}

export default MyNavbar;