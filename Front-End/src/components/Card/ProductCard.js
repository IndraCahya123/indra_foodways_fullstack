import { useContext } from 'react';
import toRupiah from '@develoka/angka-rupiah-js';
import swal from 'sweetalert';

import { UserContext } from '../../contexts/userContext';
import { OrderContext } from '../../contexts/orderContext';

function ProductCard(props) {
    const {
        title: name,
        id: productId,
        image: imgUrl,
        price,
        user: restaurant
    } = props?.product;

    const restaurantName = restaurant?.fullname;
    const restaurantLoc = restaurant?.location;console.log(restaurantLoc);
    
    const product = {
        id: productId,
        name,
        image: imgUrl,
        price
    }
    
    const [stateUserContext] = useContext(UserContext);

    const [stateOrderContext, dispatch] = useContext(OrderContext);

    const makeOrder = (restaurant, product, location) => {
        if (stateOrderContext.restaurant == restaurantName || stateOrderContext.restaurant === "") {
            dispatch({
                type: "ADD_PRODUCT_TO_CART",
                payload: {
                    restaurant,
                    restaurantLoc: location,
                    product
                }
            });
        } else {
            swal("Maaf, anda tidak bisa pesan di restoran yang berbeda. Mau ganti restoran ? ", {
                buttons: {
                    no: {
                        text: "No, thanks",
                        value: "no"
                    },
                    Yes: {
                        text: "Yes, please",
                        value: "yes"
                    }
                }
            }).then(value => {
                switch (value) {
                    case "no":
                        swal("Dibatalkan", "Order ke restoran baru dibatalkan", "info");
                        break;
                    case "yes":
                        dispatch({
                            type: "CHANGE_RESTAURANT",
                        });
                        swal("Pindah Restoran", "Anda kini bisa memesan di restoran lain", "success")
                            .then(() => {
                                dispatch({
                                    type: "ADD_PRODUCT_TO_CART",
                                    payload: {
                                        restaurant,
                                        restaurantLoc: location,
                                        productId
                                    }
                                })
                            });
                        break;
                
                    default:
                        break;
                }
            })
        }
    }

    return (
        <div className="d-flex flex-column my-5" style={{ backgroundColor: "#fff", padding: 10, borderRadius: 5, margin: "0 20px" }}>
            <img 
                src={imgUrl}
                alt="Product Image"
                width="224px"
                height="134px"
            />
            <div className="product-text d-flex flex-column my-4" style={{ width: 224 }}>
                <span style={{ fontSize: 18, fontFamily: "'Abhaya Libre'", fontWeight: "bold", height: 55 }}>{name}</span>
                <span style={{ fontSize: 14, fontFamily: "'Nunito Sans'", color: "#FF1515" }}>{ toRupiah(price, {formal: false}) }</span>
            </div>
            <button
                className="btn-sm"
                style={{ background: "#FFC700", width: "100%", border: "none", fontSize: "14px", fontFamily: "'Nunito Sans'", fontWeight: "bold" }}
                onClick={() => makeOrder(restaurantName, product, restaurantLoc)}>
                Order
            </button>
        </div>
    )
}

export default ProductCard
