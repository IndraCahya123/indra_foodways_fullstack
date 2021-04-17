import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { OrderContext } from '../../contexts/orderContext';

import CartBadge from './CartBadge';
import CartIcon from '../../images/cart.png';

function Cart() {
    const [state] = useContext(OrderContext);

    const history = useHistory();

    return (
        <>
            <button type="button" onClick={() => history.push('/orders')} style={{ background: "none", border: "none", padding: "-10px", }}>
                <img
                    src={CartIcon}
                    alt="Cart"
                    width="35px"
                    height="32px"
                />
                {state.orders.length != "undefined" ? <CartBadge orders={state.orders} /> : <CartBadge totalOrder="" /> }
            </button>
        </>
    )
}

export default Cart
