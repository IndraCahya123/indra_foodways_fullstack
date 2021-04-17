import { useContext, useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Form, Col } from 'react-bootstrap';

import { OrderContext } from '../../contexts/orderContext';
import { ModalContext } from '../../contexts/modalContext';
import { StatusBoxMapContext } from '../../contexts/statusBoxMapContext';
import { CurrentLocationContext } from '../../contexts/currentLocationContext';

import ModalMaps from '../../components/Modal/ModalMaps';
import OrderLeftContent from '../../components/OrderLeftContent';
import OrderRightContent from '../../components/OrderRightContent';

import MapsIcon from '../../images/maps.png';
import { locToObj } from '../../util/locationStringToObj';
import { APIURL } from '../../api/integration';

const OrderPage = () => {
    const history = useHistory();

    const [state, dispatch] = useContext(OrderContext);
    const [stateMap, dispatchMap] = useContext(ModalContext);
    const [stateStatusBoxMap, dispatchStatusBoxMap] = useContext(StatusBoxMapContext);
    const [myLocation, setNewLocation] = useContext(CurrentLocationContext);

    const [initialLoc, setInitalLoc] = useState("");
    const [loadMap, setLoadMap] = useState(true);
    const [address, setAddress] = useState("");

    const getUserDataLoc = async () => {
        const res = await APIURL.get("/user");

        const data = res.data.data;

        if (data.user.location == "") {
            await navigator.geolocation.getCurrentPosition(pos => {
                setNewLocation({
                    type: "SET_MY_LOCATION",
                    payload: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                });
                setInitalLoc(`${pos.coords.latitude},${pos.coords.longitude}`);
                myAdress(pos.coords.latitude, pos.coords.longitude);
            }, err => {
                console.log(err);
            }, { enableHighAccuracy: true });
        } else {
            setInitalLoc(data.user.location);
            const setInitialLoc = locToObj(data.user.location);
            myAdress(setInitialLoc.latitude, setInitialLoc.longitude);
        }
    }
    
    const myAdress = async (lat, long) => {
        await axios.get(`http://api.positionstack.com/v1/reverse?access_key=cfb5b411b150ee888fe2dcd72d3676a9&query=${lat},${long}`)
        .then(response => {
            setAddress(response.data.data[0].label);
            setNewLocation({ type: "LOAD_SUCCESS" });
            setInitalLoc(`${lat},${long}`);
            setLoadMap(false);
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        getUserDataLoc();
    }, []);

    if (myLocation.setNew == true) {
        myAdress(myLocation.latitude, myLocation.longitude);
        setNewLocation({
            type: "SUCCESS_SET_NEW_LOCATION"
        })
    }

    const totalQuantityAllOrder = () => {
        const getQty = state.orders.map(product => product.qty);

        let total = 0;

        for (let i = 0; i < getQty.length; i++) {
            total = total + getQty[i];
        }

        return total;
    }

    const totalPrice = () => {
        const getAllTotalPricePerProduct = state.orders.map(product => {
            const totalPerProduct = product.price * product.qty
            return totalPerProduct
        });

        let total = 0;

        for (let i = 0; i < getAllTotalPricePerProduct.length; i++) {
            total = total + getAllTotalPricePerProduct[i];
        }

        return total;
    }

    const checkoutOrders = () => {
        dispatchStatusBoxMap({ type: "CHECKOUT_BUTTON" });
        dispatchMap({ type: "SHOW_MAP" });
    }
    
    const orderProgress = () => {
        dispatchMap({ type: "SHOW_MAP" });
    }
    
    return (
        <div style={{ padding: "103px 0 50px" }}>
            <div className="order-wrapper d-flex flex-column" style={{ minHeight: "100vh" ,width: "80%", margin: "0 auto" }}>
                {state.orders.length === 0 ? 
                    <p style={{ fontFamily: "'Abhaya Libre'", fontSize: 36, letterSpacing: 2 }}>Restaurant</p>
                    : <p style={{ fontFamily: "'Abhaya Libre'", fontSize: 36, letterSpacing: 2 }}>{ state.restaurant }</p>
                }
                <div className="location-wrapper w-100">
                    <span style={{ color: "#613D2B", fontFamily: "'Nunito Sans'", fontSize: 18, marginLeft: 5, fontWeight: "bolder" }}>Delivery Location</span>
                    <Form style={{ marginTop: 10 }}>
                        <Form.Row>
                            <Col md="9">
                                <Form.Control id="input-white-bg" type="text" name="location" placeholder="set your location" disabled
                                value={ loadMap ? "load.." : address } />
                            </Col>
                            <Col md="3">
                                <button type="button" className="btn btn-dark w-100"
                                    onClick={
                                        () => {
                                            dispatchStatusBoxMap({ type: "SET_LOCATION_BUTTON" });
                                            dispatchMap({ type: "SHOW_MAP" });
                                        }
                                    }
                                >
                                    <span>
                                    Select On Map
                                        <img
                                        src={MapsIcon}
                                        alt="Maps Icon"
                                        className="ml-3"
                                    />
                                    </span>
                                </button>
                            </Col>
                        </Form.Row>
                    </Form>
                </div>
                <div className="product-order-wrapper w-100 mt-5" >
                    <p style={{ color: "#613D2B", fontFamily: "'Nunito Sans'", fontSize: 18, marginLeft: 5, marginBottom: 5, fontWeight: "bolder" }} >Review Your Order</p>
                    <div className="product-order d-flex justify-content-between">
                        {state.orders.length === 0 ?
                            <button type="button" onClick={() => history.push("/")} className="btn btn-dark" style={{ height: 40, width: "25%", margin: "auto" }}>Order Now</button> : 
                            <div className="products" style={{ width: "70%" }} >
                            <hr />
                            {state.orders.map(product => <OrderLeftContent product={product} dispatch={dispatch} className="w-100"/> )}
                            </div>
                            }
                        <div className="total-price" style={{ width: "25%" }} >
                            <hr />
                            <OrderRightContent total={totalQuantityAllOrder()} totalPrice={ totalPrice() }/>
                        </div>
                    </div>
                </div>
                <div className="order-button d-flex justify-content-end w-100" style={{ marginTop: 80 }}>
                    
                        <button type='button' className="btn btn-dark w-25" onClick={() => checkoutOrders()} {...state.orders.length === 0 ? "disabled" : "none"}>
                            Checkout Order
                        </button>
                    
                </div>
            </div>
            <ModalMaps totalPrice={totalPrice()} longLat={locToObj(initialLoc)} partnerLoc={{latitude: 0, longitude: 0}}/>
        </div>
    )
}

export default OrderPage;

