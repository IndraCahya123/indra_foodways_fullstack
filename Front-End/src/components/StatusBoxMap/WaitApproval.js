import { useContext, useState, useEffect } from 'react';
import axios from 'axios';

import { ModalContext } from '../../contexts/modalContext';

import locationIcon from '../../images/location.png';

const WaitApproval = (props) => {
    const [stateModalMap, dispatchModalMap] = useContext(ModalContext);

    const [address, setAddress] = useState("");
    const [load, setLoad] = useState(true);
    
    const myAdress = async (lat, long) => {
        await axios.get(`http://api.positionstack.com/v1/reverse?access_key=cfb5b411b150ee888fe2dcd72d3676a9&query=${lat},${long}`)
        .then(response => {
            setAddress(response.data.data[0].label);
            setLoad(false)
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        myAdress(props.locationName.latitude, props.locationName.longitude)
    }, []);

    const closeMap = () => {
        dispatchModalMap({ type: "CLOSE_MAP" });
    }

    return (
        <div style={{
            position: "absolute",
            top: 10,
            right: 10,
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
            <p style={{ fontFamily: "'Abhaya Libre'", fontSize: 24, fontWeight: "bolder" }}>Waiting for your order</p>
            <div className="d-flex align-items-center mb-3">
                <img
                    src={locationIcon}
                    alt="location pin"
                />
                <span style={{ fontFamily: "'Nunito Sans'", fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>{load ? "load..." : address}</span>
            </div>
            <button type="button" className="btn-sm btn-dark w-100" onClick={() => closeMap()}> Close Map </button>
        </div>
    )
}


export default WaitApproval;