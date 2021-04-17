import { useContext } from 'react';
import {useHistory} from 'react-router-dom';

import { Card } from 'react-bootstrap';

import { UserContext } from '../../contexts/userContext';
import { ModalContext } from '../../contexts/modalContext';

function RestaurantCard(props) {
    const history = useHistory();

    const [state] = useContext(UserContext);
    const [stateModalLogin, dispatch] = useContext(ModalContext);

    const loginStatus = (id) => {
        if (state.loginStatus === true) {
            history.push(`/restaurant-product-detail/${id}`);
        } else {
            dispatch({ type: "SHOW_LOGIN" });
        }
    }

    const {name, logo, restId} = props;
    return (
        <div>
            <Card onClick={() => loginStatus(restId)} style={{ cursor: "pointer" }}>
                <Card.Body>
                    <img
                        src={logo}
                        alt="Restaurant Brand"
                        width="65px"
                        height="65px"
                        style={{
                            borderRadius: "50%"
                        }}
                        />
                    <span style={{ fontFamily: "Abhaya Libre", fontSize: 22, marginLeft: 10 }}>{name}</span>
                </Card.Body>
            </Card>
        </div>
    )
}

export default RestaurantCard
