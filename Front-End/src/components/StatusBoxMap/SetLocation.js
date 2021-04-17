import { useContext } from 'react';

import { ModalContext } from '../../contexts/modalContext';
import { CurrentLocationContext } from '../../contexts/currentLocationContext';

import locationIcon from '../../images/location.png';

const SetLocation = (props) => {
    const [stateModalMap, dispatchModalMap] = useContext(ModalContext);
    const [location, setNewLocation] = useContext(CurrentLocationContext);

    const setLocation = () => {
        setNewLocation({
            type: "SET_MY_NEW_LOCATION",
            payload: props?.newLocation
        });
        dispatchModalMap({ type: "CLOSE_MAP" });
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
            <button type="button" className="btn-sm btn-dark w-100" onClick={() => setLocation()}> Confirm Location </button>
        </div>
    )
}

export default SetLocation;