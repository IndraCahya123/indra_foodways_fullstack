import {Badge} from 'react-bootstrap';

function CartBadge(props) {
    const orders = props.orders;

    const totalQty = () => {
        if (orders != "undefined") {
            const qytPerProduct = orders.map(product => product.qty);
    
            let total = 0;
    
            for (let i = 0; i < qytPerProduct.length; i++) {
                total = total + qytPerProduct[i];
            }
    
            return total;
        } else {
            return "";
        }
    }
    return (
        <div style={{ position: "relative", display: "inline-block", bottom: 10 }}>
            <Badge variant="danger" style={{ borderRadius: "50%" }}>{totalQty() === 0 ? "" : totalQty()}</Badge>
        </div>
    )
}

export default CartBadge
