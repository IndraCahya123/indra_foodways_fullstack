import { useContext } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import { APIURL } from '../../api/integration';

import { StatusBoxMapContext } from '../../contexts/statusBoxMapContext';
import { ModalContext } from '../../contexts/modalContext';
import { OrderContext } from '../../contexts/orderContext';
import { CurrentLocationContext } from '../../contexts/currentLocationContext';

import locationIcon from '../../images/location.png';

const CheckoutOrders = (props) => {
    const [stateStatusBox, dispatchStatusBox] = useContext(StatusBoxMapContext);
    const [stateModalMap, dispatchModalMap] = useContext(ModalContext);
    const [stateOrder, dispatchOrder] = useContext(OrderContext);
    const [location, setNewLocation] = useContext(CurrentLocationContext);

    const history = useHistory();console.log("customerLoc",props.orderLocation, "restaurantLoc", stateOrder.restaurantLoc);

    const createTransaction = useMutation(async () => {
        const data = stateOrder.orders.map(product => {
            const order = {
                id: product.id,
                qty: product.qty
            }
            return order
        });

        const { latitude, longitude } = props.orderLocation;
        
        const newDate = new Date();
        newDate.setDate(newDate.getDate());
        const currentDate = newDate.toDateString();
    
        const total = props.totalPrice;
        const customerLoc = `${latitude},${longitude}`;
        const restaurantLoc = stateOrder.restaurantLoc;

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
    
        const body = JSON.stringify({
            total,
            currentDate,
            customerLoc,
            restaurantLoc,
            orders: data,
        });
        console.log(body);

        await APIURL.post("/transaction", body, config)

        setLocation();
    });

    const setLocation = () => {
        if (createTransaction.isError) {
            swal("Order Failed", "Maaf, sepertinya terjadi kesalahan saat pesan", "info")
        } else {
            dispatchModalMap({ type: "CLOSE_MAP" });
            setNewLocation({
                type: "SET_MY_NEW_LOCATION",
                payload: props?.orderLocation
            });
            swal("Order Success", "Pesanan anda telah dibuat, tunggu disetujui partner kami ya", "success")
                .then(() => {
                    dispatchOrder({ type: "CHECKOUT_ORDERS" });
                    dispatchStatusBox({ type: "CHECKOUT_ORDERS" });
                    history.push("/profile");
            });
        }
        
    }

    const persentage = 50;

    return (
        <div style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: `translateX(-${persentage}%)`,
            backgroundColor: "#fff",
            width: 350,
            minHeight: 150,
            zIndex: 10,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            display: "flex",
            flexDirection: "column",
            padding: 15
        }}>
            <p style={{ fontFamily: "'Abhaya Libre'", fontSize: 24, fontWeight: "bolder" }}>Select My Location</p>
            <div className="d-flex align-items-center mb-3">
                <img
                    src={locationIcon}
                    alt="location pin"
                />
                <span style={{ fontFamily: "'Nunito Sans'", fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>{props.locationName}</span>
            </div>
            <button type="button" className="btn-sm btn-dark w-100" onClick={() => createTransaction.mutate()}> Confirm Location </button>
        </div>
    )
}

export default CheckoutOrders;