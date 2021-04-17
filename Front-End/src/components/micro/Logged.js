import {useContext, useEffect, useState} from 'react';
import {Dropdown} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';

import { UserContext } from '../../contexts/userContext';

import MyCart from './Cart';

import AddProduct from '../../images/add_product.png';
import Logout from '../../images/logout.png';
import UserIcon from '../../images/user.png';
import { useQuery } from 'react-query';
import { APIURL, setAuthToken } from '../../api/integration';

function Logged() {
    const [state, dispatch] = useContext(UserContext);
    const [getUser, setUser] = useState({
        user: {},
        load: true,
    })

    const fetchDataUser = async () => {
        const res = await APIURL.get("/user");
        setUser({
            user: res.data.data,
            load: false,
        });
    }
    
    if (state.loading) {
        dispatch({
            type: "SUCCESS_EDIT"
        });
        fetchDataUser();
    }
    
    useEffect(() => {
        fetchDataUser();
    }, []);
    
    switch (state?.user?.role) {
        case "partner":
            return (
                <>
                    {getUser.load ? "load..." : <PartnerDropdownMenu state={getUser.user} dispatch={dispatch} />}
                </>
            );
        case "user":
            return (
                <>
                    {getUser.load ? "load..." : <CustomerDropdownMenu state={getUser.user} dispatch={dispatch} />}
                </>
            );
            
        default:
            break;
    }
}

function CustomerDropdownMenu(props) {
    const history = useHistory()
    console.log("navbar",props.state.user.image);
    return(
        <>
            <MyCart />
            <Dropdown style={{ padding: "0" }}>
                <Dropdown.Toggle variant="none" style={{ padding: "auto 0" }} id="dropdown-basic">
                            <img 
                                src={props.state.user.image}
                                alt="Customer Rounded Image"
                                width="40px"
                                height="40px"
                                style={{ borderRadius: "50%" }}
                            />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => history.push(`/profile`)} className="d-flex align-items-center">
                        <img 
                            src={UserIcon}
                            alt="User Icon"
                            width="25px"
                            height="25px"
                            className="mr-2"
                        />
                        <span style={{ fontFamily: "'Nunito Sans'", fontWeight: "800" }}>Profile</span>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => {
                        props.dispatch({ type: "LOGOUT" });
                        history.push('/');
                    }} className="d-flex align-items-center">
                        <img 
                            src={Logout}
                            alt="Logout Icon"
                            width="25px"
                            height="25px"
                            className="mr-2"
                        />
                        <span style={{ fontFamily: "'Nunito Sans'", fontWeight: "800" }}>Logout</span>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    ); 
}

function PartnerDropdownMenu(props){
    const history = useHistory();
    return(
        <>
            <Dropdown>
                <Dropdown.Toggle variant="none" id="dropdown-basic">
                        <img 
                            src={props.state.user.image}
                            alt="Customer Rounded Image"
                            width="40px"
                            height="40px"
                            style={{ borderRadius: "50%" }}
                            />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => history.push('/profile')} className="d-flex align-items-center">
                        <img 
                            src={UserIcon}
                            alt="User Icon"
                            width="25px"
                            height="25px"
                            className="mr-2"
                        />
                        <span style={{ fontFamily: "'Nunito Sans'", fontWeight: "800" }}>Profile Partner</span>
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/add-product" className="d-flex align-items-center">
                        <img 
                            src={AddProduct}
                            alt="User Icon"
                            width="25px"
                            height="25px"
                            className="mr-2"
                            />
                        <span style={{ fontFamily: "'Nunito Sans'", fontWeight: "800" }}>Add Product</span>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => {
                        props.dispatch({ type: "LOGOUT" });
                        history.push('/');
                    }} className="d-flex align-items-center">
                    <img 
                        src={Logout}
                        alt="Logout Icon"
                        width="25px"
                        height="25px"
                        className="mr-2"
                        />
                    <span style={{ fontFamily: "'Nunito Sans'", fontWeight: "800" }}>Logout</span>
                </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    ); 
}

export default Logged
