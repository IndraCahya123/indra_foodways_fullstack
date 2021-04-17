import {useContext} from 'react';

import { ModalContext } from '../../contexts/modalContext';

import ModalLogin from '../Modal/ModalLogin';
import ModalRegister from '../Modal/ModalRegister';

function NotLogged() {
    const [stateModalLogin, dispatch] = useContext(ModalContext);
    
    return(
        <>
            <button type="button" style={{ padding: "5px 15px", marginRight: 10 }}
                onClick={() => dispatch({type: "SHOW_LOGIN"}) }
                className="btn btn-dark">Login</button>
            <button type="button" style={{ padding: "5px 15px" }} className="btn btn-dark"
                onClick={() => dispatch({type: "SHOW_REGISTER"})}
            >Register</button>
            <ModalLogin />
            <ModalRegister />
        </>
    );
}

export default NotLogged;