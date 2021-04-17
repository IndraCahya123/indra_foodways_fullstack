import { Form } from 'react-bootstrap';
import toRupiah from '@develoka/angka-rupiah-js';

import RemoveIcon from '../images/remove.png';

function OrderLeftContent(props) {
    const removeProduct = () => {
        props.dispatch({
            type: "REMOVE_PRODUCT",
            payload: {
                id: props.product.id,
            },
        })
    }

    const decreaseQuantity = () => {
        props.dispatch({
            type: "DECREASE_QTY",
            payload: {
                id: props.product.id
            }
        })
    }

    const increaseQuantity = () => {
        props.dispatch({
            type: "INCREASE_QTY",
            payload: {
                id: props.product.id
            }
        })
    }

    return (
        <>
            <div className="d-flex">
                <div className="product-image mr-2">
                    <img
                        src={props.product.image}
                        alt="Product Image"
                        width="80px"
                        height="80px"
                    />
                </div>
                <div className="d-flex flex-column w-100 py-2">
                    <div className="d-flex justify-content-between mb-2">
                        <span style={{ fontFamily: "'Nunito Sans'", fontWeight: "bold" }}>{ props.product.name }</span>
                        <span style={{ color: "red" }}>{ toRupiah((props.product.price * props.product.qty), {formal: false}) }</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div className="quantity-order d-flex align-items-center">
                            <span style={{ fontSize: 14, margin: "0 4px", fontWeight: "bold", cursor: "pointer" }} onClick={
                                () => {
                                    props.product.qty === 1 ? removeProduct() : decreaseQuantity()
                                }
                            }>-</span>
                            <Form.Control value={props.product.qty} style={{ width: 35, height: 20 }} />
                            <span style={{ fontSize: 14, margin: "0 4px", fontWeight: "bold", cursor: "pointer" }} onClick={
                                () => increaseQuantity()
                            }>+</span>
                        </div>
                        <button type="button" onClick={() => removeProduct()} style={{ background: "none", border: "none" }}>
                            <img
                                src={RemoveIcon}
                                alt="Remove Order Icon"
                            />
                        </button>
                    </div>
                </div>
            </div>
            <hr />
        </>
    );
}

export default OrderLeftContent
